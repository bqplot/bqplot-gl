// some helper functions to quickly create widgets

async function create_model_bqplot(
  manager,
  name: string,
  id: string,
  args: Object
) {
  return create_model(manager, 'bqplot', `${name}Model`, `${name}`, id, args);
}

async function create_model_bqplotgl(
  manager,
  name: string,
  id: string,
  args: Object
) {
  return create_model(
    manager,
    'bqplot-gl',
    `${name}Model`,
    `${name}View`,
    id,
    args
  );
}

async function create_model_bqscales(
  manager,
  name: string,
  id: string,
  args: Object
) {
  return create_model(manager, 'bqscales', `${name}Model`, name, id, args);
}

async function create_model(
  manager,
  module_name: string,
  model: string,
  view: string,
  id: string,
  args = {}
) {
  const model_widget = await manager.new_widget(
    {
      model_module: module_name,
      model_name: model,
      model_module_version: '*',
      view_module: module_name,
      view_name: view,
      view_module_version: '*',
      model_id: id,
    },
    args
  );
  return model_widget;
}

async function create_view(manager, model, options = {}) {
  const view = await manager.create_view(model, options);
  return view;
}

export async function create_figure_scatter(manager, x, y, log = false) {
  const layout = await create_model(
    manager,
    '@jupyter-widgets/base',
    'LayoutModel',
    'LayoutView',
    'layout_figure1',
    { _dom_classes: '', width: '400px', height: '500px' }
  );
  let scale_x;
  let scale_y;
  if (log) {
    scale_x = await create_model_bqscales(manager, 'LogScale', 'scale_x', {
      min: 0.01,
      max: 100,
      allow_padding: false,
    });
    scale_y = await create_model_bqscales(manager, 'LogScale', 'scale_y', {
      min: 0.1,
      max: 10,
      allow_padding: false,
    });
  } else {
    scale_x = await create_model_bqscales(manager, 'LinearScale', 'scale_x', {
      min: 0,
      max: 1,
      allow_padding: false,
    });
    scale_y = await create_model_bqscales(manager, 'LinearScale', 'scale_y', {
      min: 2,
      max: 3,
      allow_padding: false,
    });
  }
  // TODO: the default values for the ColorScale should not be required, but defined in the defaults method
  const scale_color = await create_model_bqscales(
    manager,
    'ColorScale',
    'scale_color',
    { scheme: 'RdYlGn', colors: [] }
  );
  const scales = {
    x: scale_x.toJSON(),
    y: scale_y.toJSON(),
    color: scale_color.toJSON(),
  };
  const color = null;
  const size = null;
  const opacity = null;
  const rotation = null;
  const skew = null;

  const scatterModel = await create_model_bqplotgl(
    manager,
    'ScatterGL',
    'scatter1',
    {
      scales: scales,
      x: x,
      y: y,
      color: color,
      size: size,
      opacity: opacity,
      rotation: rotation,
      skew: skew,
      colors: ['steelblue'],
      visible: true,
      default_size: 64,
      selected_style: {},
      unselected_style: {},
      hovered_style: {},
      unhovered_style: {},
      preserve_domain: {},
    }
  );
  let figureModel;
  try {
    figureModel = await create_model_bqplot(manager, 'Figure', 'figure1', {
      scale_x: scales['x'],
      scale_y: scales['y'],
      layout: layout.toJSON(),
      _dom_classes: [],
      figure_padding_y: 0,
      fig_margin: { bottom: 0, left: 0, right: 0, top: 0 },
      marks: [scatterModel.toJSON()],
    });
  } catch (e) {
    console.error('error', e);
  }
  const figure = await create_view(manager, figureModel);
  await manager.display_view(undefined, figure);
  await figure._initial_marks_created;
  return { figure: figure, scatter: await figure.mark_views.views[0] };
}
