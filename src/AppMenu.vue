<template>
  <div class="layout-menu-container">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" src="/images/logo.png" />
      <span>Block Assets</span>
    </router-link>
    <slot></slot>
    <AppSubmenu
      :items="model"
      class="layout-menu"
      :root="true"
      @menuitem-click="onMenuItemClick"
      @keydown="onKeyDown"
    />
  </div>
</template>

<script>
import AppSubmenu from "./AppSubmenu";

export default {
  props: {
    model: Array,
  },
  methods: {
    onMenuItemClick(event) {
      this.$emit("menuitem-click", event);
    },
    onKeyDown(event) {
      const nodeElement = event.target;
      if (event.code === "Enter" || event.code === "Space") {
        nodeElement.click();
        event.preventDefault();
      }
    },
  },
  components: {
    AppSubmenu: AppSubmenu,
  },
};
</script>
<style lang="scss" scoped>
.layout-topbar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--surface-900);
  font-size: 1.5rem;
  font-weight: 500;
  width: 250px;

  img {
    height: 2.5rem;
    margin-right: 0.5rem;
  }
}
</style>