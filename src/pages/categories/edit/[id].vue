<script setup>

import { requiredValidator } from '@validators';
import { onMounted } from 'vue';
import { useToast } from "vue-toastification";
import { VForm } from 'vuetify/components/VForm';
import { useCategoryStore } from '../useCategoryStore';

const categoryStore = useCategoryStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const errors = ref({
  name: undefined,
})

const refVForm = ref()
const name = ref('')

const updateCategory = () => {

  categoryStore.updateCategory(route.params.id, {
    name: name.value,
  }).then(r => {

    toast.success("Category updated successfull!");
    router.replace('/categories/list')
  }).catch(e => {

    const { errors: formErrors } = e.response.data
    errors.value = formErrors
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      updateCategory()
  })
}

const getCategory = () => {
  categoryStore.fetchCategory(route.params.id).then(r => {

    name.value = r.data.category.name

  }).catch(e => {

    toast.error("Something went wrong!");
  })
}

onMounted(getCategory)

</script>


<template>
  <div>
    <VCard title="Edit Category">
      <VForm ref="refVForm" @submit.prevent="onSubmit">
        <VRow class="mx-3 my-3">
          <VCol cols="6">
            <AppTextField v-model="name" label="Name" type="text" autofocus :rules="[requiredValidator]"
              :error-messages="errors.name" />
          </VCol>
        </VRow>
        <VRow class="mx-3 my-3">
          <VCol cols="2">
            <VBtn block type="submit">
              Save
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </div>
</template>
