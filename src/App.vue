<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick">
        <AppProfile />
      </AppMenu>
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>

    <AppConfig
      :layoutMode="layoutMode"
      @layout-change="onLayoutChange"
      @change-theme="changeTheme"
    />
    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script>
import { find, map } from "lodash";
import EventBus from './AppEventBus';
import AppTopBar from "./AppTopbar.vue";
import AppMenu from "./AppMenu.vue";
import AppConfig from "./AppConfig.vue";
import AppFooter from "./AppFooter.vue";
import AppProfile from "./AppProfile.vue";
import SettingsService from "./service/SettingsService";

export default {
  emits: ["change-theme"],
  data() {
    return {
      layoutMode: "static",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          label: "Home",
          items: [
            {
              label: "Dashboard",
              icon: "pi pi-fw pi-home",
              to: "/summary",
            },
            {
              label: "Summary",
              icon: "pi pi-fw pi-chart-pie",
              to: "/",
            },
          ],
        },
        {
          label: "Allocations",
          items: [
            {
              label: "Employees",
              icon: "fas fa-users",
              to: "/emp-assgn",
            },
          ],
        },
        {
          label: "Inventory",
          icon: "pi pi-fw pi-sitemap",
          items: [
            {
              label: "Desktop",
              icon: "pi pi-fw pi-desktop",
              to: "/crud",
            },
            { label: "Laptop", icon: "fas fa-laptop", to: "/input" },
            {
              label: "Mac",
              icon: "fab fa-apple",
              to: "/floatlabel",
            },
            {
              label: "Printers",
              icon: "fas fa-print",
              to: "/invalidstate",
            },
            {
              label: "New Asset Type",
              icon: "pi pi-fw pi-plus-circle",
              to: "/new-asset",
            },
          ],
        },
        {
          label: "Inventory Settings",
          id: "inv-setting",
          icon: "pi pi-fw pi-clone",
          items: [
            {
              label: "New Setting",
              icon: "pi pi-fw pi-plus-circle",
              to: "/settings/new",
            },
          ],
        },
      ],
    };
  },
  settingsService: null,
  reloadSettingsListener: null,
  created() {
    this.settingsService = new SettingsService();
  },
  async mounted() {
    this.reloadSettingsListener = async () => {
      const settings = await this.settingsService.getSettingsList();
      const settingsMenu = find(this.menu, { id: "inv-setting" });
      settingsMenu.items = settingsMenu.items.slice(-1);
      const items = map(settings, (setting) => {
        return {
          label: setting?.name,
          icon: setting?.icon?.code,
          to: `/settings/${setting?.id}`,
        };
      });
      settingsMenu.items.unshift(...items);
    }
    this.reloadSettingsListener();
    EventBus.on('reload-settings', this.reloadSettingsListener);
  },
  beforeUnmount() {
    EventBus.on('reload-settings', this.reloadSettingsListener)
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    addClass(element, className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    },
    removeClass(element, className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") return !this.staticMenuInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
      }

      return true;
    },
    changeTheme(event) {
      this.$emit("change-theme", event);
    },
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
        },
      ];
    },
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  },
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
    AppConfig: AppConfig,
    AppFooter: AppFooter,
    AppProfile,
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>
