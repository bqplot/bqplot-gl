float scale_transform_linear(float domain_value, vec2 range, vec2 domain) {
    float normalized = (domain_value - domain[0]) / (domain[1] - domain[0]);
    float range_value = normalized * (range[1] - range[0]) + range[0];
    return range_value;
}

float scale_transform_linear_inverse(float range_value, vec2 range, vec2 domain) {
    float normalized = (range_value - range[0]) / (range[1] - range[0]);
    float domain_value = normalized * (domain[1] - domain[0]) + domain[0];
    return domain_value;
}

float scale_transform_log(float domain_value, vec2 range, vec2 domain) {
    float normalized = (log(domain_value) - log(domain[0])) / (log(domain[1]) - log(domain[0]));
    float range_value = normalized * (range[1] - range[0]) + range[0];
    return range_value;
}

float scale_transform_log_inverse(float range_value, vec2 range, vec2 domain) {
    float normalized = (range_value - range[0]) / (range[1] - range[0]);
    float domain_value = exp(normalized * (log(domain[1]) - log(domain[0])) + log(domain[0]));
    return domain_value;
}

#define SCALE_TYPE_LINEAR 1
#define SCALE_TYPE_LOG 2

#ifdef USE_SCALE_X
    uniform vec2 domain_x;
    uniform vec2 range_x;
    #if SCALE_TYPE_X == SCALE_TYPE_LINEAR
        #define SCALE_X(x) scale_transform_linear(x, range_x, domain_x)
    #elif SCALE_TYPE_X == SCALE_TYPE_LOG
        #define SCALE_X(x) scale_transform_log(x, range_x, domain_x)
    #endif
#else
    #define SCALE_X(x) x
#endif

#ifdef USE_SCALE_Y
    uniform vec2 domain_y;
    uniform vec2 range_y;
    #if SCALE_TYPE_Y == SCALE_TYPE_LINEAR
        #define SCALE_Y(x) scale_transform_linear(x, range_y, domain_y)
    #elif SCALE_TYPE_Y == SCALE_TYPE_LOG
        #define SCALE_Y(x) scale_transform_log(x, range_y, domain_y)
    #endif
#else
    #define SCALE_Y(x) x
#endif
