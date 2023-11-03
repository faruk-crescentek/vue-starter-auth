<script setup>
import { alphaValidator, integerValidator, requiredValidator } from '@/@core/utils/validators';
import axios from '@axios';
import avatar1 from '@images/avatars/avatar-14.png';
import { useToast } from "vue-toastification";

const refVForm = ref()
const toast = useToast();

const errors = {
  name: '',
  email: '',
}

const validationError = ref({});

const accountData = {
  avatar: avatar1,
  name: '',
  email: '',
  phone_number: '',
  address: '',
  state: '',
  zip_code: '',
  country: '',
  language: '',
  timezone: '',
  currency: '',
}

const refInputEl = ref()
const accountDataLocal = ref(structuredClone(accountData))

const resetForm = () => {
  accountDataLocal.value = structuredClone(accountData)
}

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatar = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatar = accountData.avatar
}

const timezones = [
  '(GMT-11:00) International Date Line West',
  '(GMT-11:00) Midway Island',
  '(GMT-10:00) Hawaii',
  '(GMT-09:00) Alaska',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-08:00) Tijuana',
  '(GMT-07:00) Arizona',
  '(GMT-07:00) Chihuahua',
  '(GMT-07:00) La Paz',
  '(GMT-07:00) Mazatlan',
  '(GMT-07:00) Mountain Time (US & Canada)',
  '(GMT-06:00) Central America',
  '(GMT-06:00) Central Time (US & Canada)',
  '(GMT-06:00) Guadalajara',
  '(GMT-06:00) Mexico City',
  '(GMT-06:00) Monterrey',
  '(GMT-06:00) Saskatchewan',
  '(GMT-05:00) Bogota',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT-05:00) Indiana (East)',
  '(GMT-05:00) Lima',
  '(GMT-05:00) Quito',
  '(GMT-04:00) Atlantic Time (Canada)',
  '(GMT-04:00) Caracas',
  '(GMT-04:00) La Paz',
  '(GMT-04:00) Santiago',
  '(GMT-03:30) Newfoundland',
  '(GMT-03:00) Brasilia',
  '(GMT-03:00) Buenos Aires',
  '(GMT-03:00) Georgetown',
  '(GMT-03:00) Greenland',
  '(GMT-02:00) Mid-Atlantic',
  '(GMT-01:00) Azores',
  '(GMT-01:00) Cape Verde Is.',
  '(GMT+00:00) Casablanca',
  '(GMT+00:00) Dublin',
  '(GMT+00:00) Edinburgh',
  '(GMT+00:00) Lisbon',
  '(GMT+00:00) London',
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'AUD',
  'BRL',
  'CAD',
  'CNY',
  'CZK',
  'DKK',
  'HKD',
  'HUF',
  'INR',
]

const user = JSON.parse(localStorage.getItem('userData'));

const getUserDetail = async () => {
  await axios.get('/user').then(r => {
    accountDataLocal.value = r.data;

  }).catch(e => {
    console.log(e);
  })
}

function updateProfile() {

  axios.put(`users/${user.id}`, accountDataLocal.value).then((r) => {

    accountDataLocal.value = r.data.user;
    toast.success("Profile updated successfully!");
  }).catch((e) => {
    console.log(e.response.data.errors);
    validationError.value = e.response.data.errors
    toast.error("Validation Error!");
  });
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      updateProfile()
    }
  })
}

onMounted(getUserDetail)

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="User Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded size="100" class="me-6" :image="accountDataLocal.avatar" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">

            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden @input="changeAvatar">

              <VBtn type="reset" color="secondary" variant="tonal" @click="resetAvatar">
                <span class="d-none d-sm-block">Reset</span>
                <VIcon icon="tabler-refresh" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-6" ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <AppTextField v-model="accountDataLocal.name" label="Name" :error-messages="validationError?.name"
                  :rules="[requiredValidator, alphaValidator]" />
                <p></p>
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.email" label="E-mail" type="email" readonly />
              </VCol>

              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.phone_number" label="Phone Number" :rules="[integerValidator]" />
              </VCol>

              <!-- 👉 Address -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.address" label="Address" />
              </VCol>

              <!-- 👉 State -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.state" label="State" />
              </VCol>

              <!-- 👉 Zip Code -->
              <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.zip_code" label="Zip Code" />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12" md="6">
                <AppSelect v-model="accountDataLocal.country" label="Country"
                  :items="['USA', 'Canada', 'UK', 'India', 'Australia']" />
              </VCol>

              <!-- 👉 Language -->
              <VCol cols="12" md="6">
                <AppSelect v-model="accountDataLocal.language" label="Language"
                  :items="['English', 'Spanish', 'Arabic', 'Hindi', 'Urdu']" />
              </VCol>

              <!-- 👉 Timezone -->
              <VCol cols="12" md="6">
                <AppSelect v-model="accountDataLocal.timezone" label="Timezone" :items="timezones"
                  :menu-props="{ maxHeight: 200 }" />
              </VCol>

              <!-- 👉 Currency -->
              <VCol cols="12" md="6">
                <AppSelect v-model="accountDataLocal.currency" label="Currency" :items="currencies"
                  :menu-props="{ maxHeight: 200 }" />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">Save changes</VBtn>

                <VBtn color="secondary" variant="tonal" type="reset" @click.prevent="resetForm">
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
