import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('[Razorpay Webhook]: RAZORPAY_WEBHOOK_SECRET not configured.')
      return NextResponse.json({ success: false, error: 'Webhook secret not configured' }, { status: 500 })
    }

    if (!signature) {
      console.error('[Razorpay Webhook]: Missing x-razorpay-signature header.')
      return NextResponse.json({ success: false, error: 'Missing signature header' }, { status: 400 })
    }

    // Verify HMAC SHA-256 signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    const sigBuf = Buffer.from(signature, 'utf8')
    const expBuf = Buffer.from(expectedSignature, 'utf8')
    const isValid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)

    if (!isValid) {
      console.error('[Razorpay Webhook]: Signature mismatch.')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    const { event, payload } = JSON.parse(rawBody)
    console.log(`[Razorpay Webhook]: Received event '${event}'`)

    const supabase = createAdminClient()

    switch (event) {
      case 'payment.captured': {
        const payment = payload?.payment?.entity
        if (!payment) break
        const internalOrderId = payment.notes?.internal_order_id || payment.receipt
        if (internalOrderId) {
          const { error } = await supabase
            .from('orders')
            .update({ payment_status: 'paid', razorpay_payment_id: payment.id })
            .eq('id', internalOrderId)
          if (error) console.error('[Razorpay Webhook]: DB update failed:', error.message)
          else console.log(`[Razorpay Webhook]: Order ${internalOrderId} marked paid (payment.captured)`)
        }
        break
      }

      case 'payment.failed': {
        const payment = payload?.payment?.entity
        if (!payment) break
        const internalOrderId = payment.notes?.internal_order_id || payment.receipt
        if (internalOrderId) {
          const { error } = await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', internalOrderId)
          if (error) console.error('[Razorpay Webhook]: DB update failed:', error.message)
        }
        break
      }

      case 'order.paid': {
        const orderEntity = payload?.order?.entity
        if (!orderEntity) break
        const internalOrderId = orderEntity.receipt || orderEntity.notes?.internal_order_id
        if (internalOrderId) {
          const { error } = await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              ...(payload?.payment?.entity?.id ? { razorpay_payment_id: payload.payment.entity.id } : {}),
            })
            .eq('id', internalOrderId)
          if (error) console.error('[Razorpay Webhook]: DB update failed:', error.message)
          else console.log(`[Razorpay Webhook]: Order ${internalOrderId} marked paid (order.paid)`)
        }
        break
      }

      default:
        console.log(`[Razorpay Webhook]: Unhandled event '${event}'`)
    }

    return NextResponse.json({ success: true, event }, { status: 200 })
  } catch (err: any) {
    console.error('[Razorpay Webhook]: Critical error:', err)
    return NextResponse.json({ success: false, error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}
