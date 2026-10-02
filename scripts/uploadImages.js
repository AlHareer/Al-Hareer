// Uploads every local image referenced by src/data/{products,testimonials,occasions}.ts
// to ImageKit, and writes scripts/imageMap.json ({ "/images/foo.jpg": "https://ik.imagekit.io/..." })
// for scripts/seed.ts to consume. Idempotent: re-running skips files already in imageMap.json.
// Run with: npm run images:upload
const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");

const {
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: urlEndpoint,
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: publicKey,
  IMAGEKIT_PRIVATE_KEY: privateKey,
} = process.env;

if (!urlEndpoint || !publicKey || !privateKey) {
  console.error("Missing ImageKit env vars. Run with: node --env-file=.env scripts/uploadImages.js");
  process.exit(1);
}

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

const DATA_DIR = path.join(__dirname, "..", "src", "data");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const MAP_PATH = path.join(__dirname, "imageMap.json");

// Data files are TypeScript, but every image path is a plain string literal like
// '/images/your-image-13.jpg' — a regex scan avoids needing a TS loader for this script.
function extractImagePaths(fileName) {
  const text = fs.readFileSync(path.join(DATA_DIR, fileName), "utf8");
  const matches = text.match(/\/images\/[A-Za-z0-9_\-\/]+\.(?:jpg|jpeg|png|webp)/g) || [];
  return matches;
}

function main() {
  const referenced = new Set([
    ...extractImagePaths("products.ts"),
    ...extractImagePaths("testimonials.ts"),
    ...extractImagePaths("occasions.ts"),
  ]);

  console.log(`Found ${referenced.size} unique referenced image paths.`);

  const imageMap = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) : {};

  return [...referenced].reduce(
    (chain, publicPath) =>
      chain.then(async () => {
        if (imageMap[publicPath]) {
          console.log(`skip (already uploaded): ${publicPath}`);
          return;
        }
        const localPath = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
        if (!fs.existsSync(localPath)) {
          console.warn(`missing local file, skipping: ${localPath}`);
          return;
        }
        const fileBuffer = fs.readFileSync(localPath);
        const fileName = path.basename(publicPath);
        const folder = "/al-hareer" + path.dirname(publicPath); // e.g. /al-hareer/images/shopby
        const result = await imagekit.upload({
          file: fileBuffer,
          fileName,
          folder,
          useUniqueFileName: false,
        });
        imageMap[publicPath] = result.url;
        fs.writeFileSync(MAP_PATH, JSON.stringify(imageMap, null, 2));
        console.log(`uploaded: ${publicPath} -> ${result.url}`);
      }),
    Promise.resolve()
  );
}

main()
  .then(() => console.log("Done. Wrote scripts/imageMap.json"))
  .catch((err) => {
    console.error("Upload failed:", err);
    process.exit(1);
  });
