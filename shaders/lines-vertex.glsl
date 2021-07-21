#include <scales>

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform vec2 domain_x;
uniform vec2 domain_y;

uniform vec2 range_x;
uniform vec2 range_y;

attribute float x;
// attribute float x_previous;
attribute float y;
// attribute float y_previous;


#define SCALE_X(x) scale_transform_linear(x, range_x, domain_x)
#define SCALE_Y(x) scale_transform_linear(x, range_y, domain_y)
#define SCALE_SIZE(x) scale_transform_linear(x, range_size, domain_size)
#define SCALE_ROTATION(x) scale_transform_linear(x, range_rotation, domain_rotation)
#define SCALE_OPACITY(x) scale_transform_linear(x, range_opacity, domain_opacity)


void main(void) {

    vec3 center_pixels = vec3(SCALE_X(x), SCALE_Y(y), 0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(center_pixels, 1.0);

}
