<script setup>

import axios from '@axios';
import { requiredValidator } from '@validators';
import { useToast } from "vue-toastification";
import { VForm } from 'vuetify/components/VForm';

const route = useRoute()
const router = useRouter()
const toast = useToast()

const errors = ref({
  name: undefined,
})

const refVForm = ref()
const name = ref('')

const saveCategory = () => {

  axios.post('/categories', {
    name: name.value,
  }).then(r => {

    toast.success("Category added successfully!");
    router.replace('/categories/list')
  }).catch(e => {

    const { errors: formErrors } = e.response.data
    errors.value = formErrors
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      saveCategory()
  })
}

</script>


<template>
  <div>
    <VCard title="Create Category">
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
