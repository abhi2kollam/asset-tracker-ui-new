<template>
  <Landing v-if="$route.path === '/landing'" @change-theme="changeTheme" />
  <Login v-else-if="$route.path === '/login'" />
  <Error v-else-if="$route.path === '/error'" />
  <NotFound v-else-if="$route.path === '/notfound'" />
  <Access v-else-if="$route.path === '/access'" />
  <App v-else @change-theme="changeTheme" />
</template>

<script>
import EventBus from "./AppEventBus";
import App from "./App";
import Landing from "./pages/LandingDemo";
import Login from "./pages/Login";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";
import Access from "./pages/Access";
export default {
  created() {
    let themeHrf = `themes/${this.$appState.theme}/theme.css`;
    const theme = localStorage.getItem("theme");
    if (theme) {
      if (theme !== this.$appState.theme) {
        themeHrf = themeHrf.replace(this.$appState.theme, theme);
        this.$appState.theme = theme;
      }
    } else {
      localStorage.setItem("theme", this.$appState.theme);
    }
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "theme-link";
    link.href = themeHrf;
    document.head.appendChild(link);
  },
  methods: {
    changeTheme(event) {
      let themeElement = document.getElementById("theme-link");
      themeElement.setAttribute(
        "href",
        themeElement
          .getAttribute("href")
          .replace(this.$appState.theme, event.theme)
      );
      this.$appState.theme = event.theme;
      localStorage.setItem("theme", this.$appState.theme);
      this.$appState.darkTheme = event.dark;
      EventBus.emit("change-theme", event);

      if (event.theme.startsWith("md")) {
        this.$primevue.config.ripple = true;
      }
    },
  },
  components: {
    App,
    Landing,
    Login,
    Error,
    NotFound,
    Access,
  },
};
</script>
