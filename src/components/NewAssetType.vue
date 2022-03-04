<template>
  <div class="card col-6">
    <div class="p-fluid">
      <h5>New Asset Type</h5>
      <div class="field grid">
        <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0"
          >Asset Type</label
        >
        <div class="col-12 md:col-10">
          <InputText id="name3" type="text" />
        </div>
      </div>
      <Fieldset legend="Property One">
        <div class="field grid">
          <label for="email3" class="col-12 mb-2 md:col-2 md:mb-0"
            >Property Name</label
          >
          <div class="col-12 md:col-10">
            <InputText id="email3" type="text" />
          </div>
        </div>
        <div class="field grid">
          <label for="email3" class="col-12 mb-2 md:col-2 md:mb-0"></label>
          <div class="col-12 md:col-10 field-checkbox">
            <Checkbox id="checkOption1" name="option" value="true" />
            <label for="checkOption1">Unique property</label>
          </div>
        </div>
        <div class="field grid">
          <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0">Type</label>
          <div class="col-12 md:col-10">
            <Dropdown
              id="state"
              v-model="dropdownItem"
              :options="dropdownItems"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
        </div>
        <div class="field grid">
          <label for="name3" class="col-12 mb-2 md:col-2 md:mb-0"
            >Complex Type</label
          >
          <div class="col-12 md:col-10">
            <Dropdown
              id="state"
              v-model="dropdownItem1"
              :options="dropdownItems1"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
        </div>
      </Fieldset>
    </div>
    <div class="grid justify-content-end mt-3">
      <Button label="Add New Property" icon="pi pi-plus-circle" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownItems: [
        { name: "String", code: "String" },
        { name: "Number", code: "Number" },
        { name: "Complex", code: "Complex" },
      ],
      dropdownItem: null,
      dropdownItems1: [
        { name: "Location", code: "String" },
        { name: "Zones", code: "Number" },
        { name: "Seat/Room", code: "Complex" },
      ],
      dropdownItem1: null,
    };
  },
};
</script>