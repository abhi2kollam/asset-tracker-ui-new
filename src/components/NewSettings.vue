/* eslint-disable vue/valid-v-for */
<template>
<Toast/>
  <form @submit.prevent="saveSettings(!v$.$invalid)" class="p-fluid">
    <div class="card col">
      <h5>New {{ type }}</h5>
      <div class="field grid">
        <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">{{ type }} Name</label>
        <div class="col-12 md:col-10">
          <InputText
            :class="{ 'p-invalid': v$.setting.name.$invalid }"
            id="name3"
            maxlength="30"
            required
            type="text"
            v-model="setting.name"
          />
        </div>
      </div>
      <div class="field grid">
        <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Icon</label>
        <div class="col-12 md:col-10">
          <Dropdown
            v-model="setting.icon"
            :class="{ 'p-invalid': v$.setting.icon.$invalid }"
            :options="fontAwesomeIcons"
            option-label="name"
            placeholder="Select icon"
            :filter="true"
            :showClear="true"
            :virtual-scroller-options="{ itemSize: 40 }"
          >
            <template #value="slotProps">
              <div
                v-if="slotProps.value"
                class="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2"
              >
                <span :class="'mr-2 ' + slotProps.value.code" style="width: 18px; height: 12px" />
                <div>{{ slotProps.value.name }}</div>
              </div>
              <template v-if="!slotProps.value || slotProps.value.length === 0">
                <div class="p-1">Select icon</div>
              </template>
            </template>
            <template #option="slotProps">
              <div class="flex align-items-center">
                <span :class="'mr-2 ' + slotProps.option.code" style="width: 18px; height: 12px" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="grid justify-content-end mt-3">
        <Button
          style="width:initial"
          label="Add New Property"
          icon="pi pi-plus-circle"
          @click="addMoreProps()"
        />
      </div>
      <div class="grid mb-3">
        <div class="col-12 xl:col-6" v-for="(prop, index) in setting.props" :key="index">
          <Fieldset :legend="`Property ${index + 1}`" class="mb-2 relative">
            <Button
              icon="pi pi-times "
              @click="deleteProp(index)"
              class="p-button-rounded p-button-warning mr-2 mb-2 close-icon"
            />
            <div class="field grid">
              <label for="email3" class="col-12 mb-2 md:col-2 md:mb-0">Property Name</label>
              <div class="col-12 md:col-10">
                <InputText
                  type="text"
                  :class="{ 'p-invalid': v$.setting.props.$each.$response.$data[index].name.$invalid }"
                  maxlength="30"
                  v-model.lazy="prop.name"
                />
              </div>
            </div>
            <div class="field grid">
              <label class="col-12 mb-2 md:col-2 md:mb-0"></label>
              <div class="col-12 md:col-10 field-checkbox">
                <InputSwitch :id="`checkOption-${index}`"  v-model="prop.isUnique"/>
                <label :for="`checkOption-${index}`">Unique property</label>
              </div>
            </div>
            <div class="field grid">
              <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Type</label>
              <div class="col-12 md:col-10">
                <Dropdown
                  id="state"
                  v-model="prop.type"
                  :options="dropdownItems"
                  optionValue="code"
                  optionLabel="name"
                  placeholder="Select Type"
                ></Dropdown>
              </div>
            </div>
            <div class="field grid" v-if="prop.type === 'Complex'">
              <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Complex Type</label>
              <div class="col-12 md:col-10">
                <Dropdown
                  id="state"
                  v-model="prop.complexType"
                  :options="dropdownItems1"
                  optionLabel="name"
                  optionValue="code"
                  placeholder="Select One"
                ></Dropdown>
              </div>
            </div>
          </Fieldset>
        </div>
      </div>
      <div class="grid col justify-content-end mt-3">
        <Button
          label="Save"
          type="submit"
          :disabled="setting.props.length === 0"
          icon="pi pi-check"
          class="p-button-success submit-button"
        />
      </div>
    </div>
  </form>
</template>

<script lang="typescript">
import { map } from "lodash";
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

import EventBus from "../AppEventBus";
import SettingsService from "../service/SettingsService";
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  props: ['type'],
  data() {
    return {
      defaultProps: {
        name: "",
        isUnique: false,
        type: "String",
        complexType: null,
      },
      setting: {
        name: "",
        icon: null,
        props: [],
      },
      dropdownItems: [
        { name: "String", code: "String" },
        { name: "Number", code: "Number" },
        { name: "Date", code: "Date" },
        { name: "Complex", code: "Complex" },
      ],
      dropdownItems1: [],
      fontAwesomeIcons: [],
    };
  },
  validations() {
    return {
      setting: {
        name: { required },
        icon: { required },
        props: {
          $each: helpers.forEach({
            name: { required }
          })
        }
      }
    }
  },
  created() {
    this.settingsService = new SettingsService();
  },
  beforeMount() {
    this.setting.props = [{ ...this.defaultProps }];
  },
  async mounted() {
    const [fontAwesomeIcons, savedSettings] = await Promise.all([this.settingsService.getFontIcons(), this.settingsService.getSettingsList()])
    this.fontAwesomeIcons = fontAwesomeIcons;
    this.dropdownItems1 = map(savedSettings, (setting) => {
      return {
        name: setting.name,
        code: setting.id,
      };
    });
  },
  methods: {
    addMoreProps() {
      this.setting.props.push({ ...this.defaultProps });
      this.v$.setting.props.reset()
    },
    async saveSettings(isFormValid) {
      if (!isFormValid) {
        return;
      }
      await this.settingsService.saveSettings(this.setting);
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Settings Updated', life: 3000});
      this.clearForm()
      EventBus.emit("reload-settings")
    },
    deleteProp(index) {
      this.setting.props.splice(index, 1);
    },
    clearForm() {
      this.setting = {
        name: "",
        icon: null,
        props: [],
      }
      this.setting.props = [{ ...this.defaultProps }];
    }
  },
};
</script>
<style scoped>
.close-icon {
  position: absolute;
  top: -3rem;
  right: -1rem;
}
.submit-button {
  width: initial;
}
</style>