import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    route("webhooks/facebook/feed", "./routes/webhooks.facebook.feed.tsx"),
] satisfies RouteConfig;
