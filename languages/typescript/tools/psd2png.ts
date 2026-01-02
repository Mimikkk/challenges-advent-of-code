import { createCanvas } from 'npm:@napi-rs/canvas';
import { initializeCanvas, type Layer, readPsd } from 'npm:ag-psd';

initializeCanvas((width, height) => createCanvas(width, height));

const buffer = await Deno.readFile(Deno.cwd() + '/tools/640x480_0.psd');
const psd = readPsd(buffer);

const layersDir = 'layers';

await Deno.mkdir(layersDir, { recursive: true });

let layerCount = 0;

function* traverseLayers(layers?: Layer[], prefix = ''): Generator<{ layer: Layer; path: string }> {
  if (!layers) return;
  for (const layer of layers) {
    const baseName = layer.name ? layer.name.replace(/[\\/:*?"<>|]+/g, '_') : 'unnamed';
    const name = `${prefix}${baseName}`;
    yield { layer, path: name };
    if (layer.children) {
      yield* traverseLayers(layer.children, name + '__');
    }
  }
}

const layerFiles: string[] = [];

for (const { layer, path } of traverseLayers(psd.children)) {
  if (layer.canvas) {
    const fileName = `${layersDir}/${path}.png`;
    const pngBuffer = layer.canvas.toBuffer('image/png');
    await Deno.writeFile(fileName, pngBuffer);
    console.log(`Saved ${fileName}`);
    layerFiles.push(fileName);
    layerCount++;
  }
}

if (layerCount === 0) {
  console.log('No layers with canvas found.');
}
