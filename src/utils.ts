import * as THREE from 'three';
import { Figure } from 'bqplot';

export enum ScaleType {
  SCALE_TYPE_LINEAR = 1,
  SCALE_TYPE_LOG = 2,
}

export interface Renderer {
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  context: WebGLRenderingContext,
  pixelRatio: number
): Renderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
  });

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(100, 100);
  renderer.setClearAlpha(0);

  const camera = new THREE.OrthographicCamera(
    -1 / 2,
    1 / 2,
    1 / 2,
    -1 / 2,
    -10000,
    10000
  );
  camera.position.z = 10;

  return { renderer, camera };
}

export function resizeRenderer(
  renderer: Renderer,
  width: number,
  height: number
) {
  renderer.camera.left = 0;
  renderer.camera.right = width;
  renderer.camera.bottom = 0;
  renderer.camera.top = height;
  renderer.camera.updateProjectionMatrix();

  renderer.renderer.setSize(width, height);
}

export function initializeBqplotFigure(figure: Figure) {
  if (!figure.extras.webGLRenderer) {
    const ext = figure.extras;

    // Create ThreeJS Renderer
    ext.webGLRenderer = createRenderer(
      figure.webGLCanvas,
      figure.webGLContext,
      figure.model.get('pixel_ratio') || window.devicePixelRatio
    );

    ext.webGLMarks = [];

    // Actual render function
    ext.webGLRender = function () {
      const renderer = this.extras.webGLRenderer.renderer;

      this.extras.webGLRenderer.renderer.setPixelRatio(
        this.model.get('pixel_ratio') || window.devicePixelRatio
      );

      resizeRenderer(
        this.extras.webGLRenderer,
        this.plotarea_width,
        this.plotarea_height
      );

      // Clear renderer
      renderer.autoClear = false;
      renderer.autoClearColor = new THREE.Color(0x000000);
      renderer.clear();

      // Render WebGL marks
      const marks = this.extras.webGLMarks;
      for (const mark of marks) {
        mark.renderGL();
      }
    }.bind(figure);

    // Render request functions
    ext.webGLUpdate = function () {
      this.extras.webGLRender();
      this.extras.webGLUpdateRequested = false;
    }.bind(figure);

    ext.webGLRequestRender = function () {
      if (!this.extras.webGLUpdateRequested) {
        this.extras.webGLUpdateRequested = true;
        requestAnimationFrame(this.extras.webGLUpdate);
      }
    }.bind(figure);

    // Render hook: Called when the Figure needs a synchronous render
    figure.renderHooks.webGLRender = ext.webGLRender;

    // Relayout hook: Called when there is a figure relayout
    figure.relayoutHooks.webGLRelayoutHook = ext.webGLRequestRender;

    // Event handlers
    figure.listenTo(figure, 'margin_updated', ext.webGLRequestRender);

    figure.listenTo(figure.model, 'change:pixel_ratio', ext.webGLRequestRender);
  }
}
