<template>
  <div>
    <VCard class="mb-6">

      <VCardText> Users </VCardText>

      <VTable density="compact" class="text-no-wrap">
        <thead>
          <tr>
            <th class="text-uppercase">
              Name
            </th>
            <th class="text-uppercase text-center">
              Email
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              {{ user.name }}
            </td>
            <td class="text-center">
              {{ user.email }}
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </div>
</template>



<script setup>
import axios from '@axios';
import { onMounted } from 'vue';

const users = ref([]);

const getUsers = async () => {
  await axios.get('/users').then(r => {
    users.value = r.data.users;

    console.log(users);
  }).catch(e => {
    console.log(e);
  })
}

onMounted(getUsers)

</script>
