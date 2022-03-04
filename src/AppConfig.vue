<template>
  <div id="layout-config" :class="containerClass">
    <a
      href="#"
      class="layout-config-button"
      id="layout-config-button"
      @click="toggleConfigurator"
    >
      <i class="pi pi-cog"></i>
    </a>
    <Button
      class="p-button-danger layout-config-close p-button-rounded p-button-text"
      icon="pi pi-times"
      @click="hideConfigurator"
      :style="{ 'z-index': 1 }"
    ></Button>

    <div class="layout-config-content">
      <h5 class="mt-0">Scale</h5>
      <div class="config-scale">
        <Button
          icon="pi pi-minus"
          @click="decrementScale()"
          class="p-button-text"
          :disabled="scale === scales[0]"
        />
        <i
          class="pi pi-circle-on"
          v-for="s of scales"
          :class="{ 'scale-active': s === scale }"
          :key="s"
        />
        <Button
          icon="pi pi-plus"
          @click="incrementScale()"
          class="p-button-text"
          :disabled="scale === scales[scales.length - 1]"
        />
      </div>

      <h5>Themes</h5>

      <div class="grid free-themes">
        <div class="col-4 text-center">
          <button
            class="p-link"
            type="button"
            @click="changeTheme($event, 'saga-blue', false)"
          >
            <img
              class="block"
              src="images/themes/saga-blue.png"
              alt="Saga Blue"
            />
          </button>
          <div  class="align-items-center flex flex-column">
            <RadioButton
              id="light"
              name="theme"
              value="saga-blue"
              v-model="theme"
            />
            <label for="light">Light</label>
          </div>
        </div>
        <div class="col-4 text-center">
          <button
            class="p-link"
            type="button"
            @click="changeTheme($event, 'vela-blue', true)"
          >
            <img
              class="block"
              src="images/themes/vela-blue.png"
              alt="Vela Blue"
            />
          </button>
          <div  class="align-items-center flex flex-column">
            <RadioButton
              id="dark"
              name="theme"
              value="vela-blue"
              v-model="theme"
            />
            <label for="dark">Dark</label>
          </div>
        </div>

        <div class="col-4 text-center">
          <button
            class="p-link"
            type="button"
            @click="changeTheme($event, 'arya-blue', true)"
          >
            <img
              class="block"
              src="images/themes/arya-blue.png"
              alt="Arya Blue"
            />
          </button>
          <div class="align-items-center flex flex-column">
            <RadioButton
              id="darker"
              name="theme"
              value="arya-blue"
              v-model="theme"
            />
            <label for="darker">Darker</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layoutMode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      active: false,
      theme: this.$appState.theme,
      d_layoutMode: this.layoutMode,
      scale: 14,
      scales: [12, 13, 14, 15, 16],
    };
  },
  watch: {
    $route() {
      if (this.active) {
        this.active = false;
        this.unbindOutsideClickListener();
      }
    },
    layoutMode(newValue) {
      this.d_layoutMode = newValue;
    },
  },
  outsideClickListener: null,
  methods: {
    toggleConfigurator(event) {
      this.active = !this.active;
      event.preventDefault();

      if (this.active) this.bindOutsideClickListener();
      else this.unbindOutsideClickListener();
    },
    hideConfigurator(event) {
      this.active = false;
      this.unbindOutsideClickListener();
      event.preventDefault();
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event) => {
          if (this.active && this.isOutsideClicked(event)) {
            this.active = false;
          }
        };
        document.addEventListener("click", this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener("click", this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    isOutsideClicked(event) {
      return !(
        this.$el.isSameNode(event.target) || this.$el.contains(event.target)
      );
    },
    decrementScale() {
      this.scale--;
      this.applyScale();
    },
    incrementScale() {
      this.scale++;
      this.applyScale();
    },
    applyScale() {
      document.documentElement.style.fontSize = this.scale + "px";
    },
    changeTheme(event, theme, dark) {
      this.theme = theme;
      this.$emit("change-theme", { theme, dark });
    },
  },
  computed: {
    containerClass() {
      return ["layout-config", { "layout-config-active": this.active }];
    },
  },
};
</script>
