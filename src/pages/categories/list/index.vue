<script setup>
import { VDataTableServer } from 'vuetify/labs/VDataTable';
import { useCategoryStore } from '../useCategoryStore';

const categoryStore = useCategoryStore()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalCategory = ref(0)
const categories = ref([]);

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const headers = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
];

// 👉 Fetching Categories
const fetchCategories = () => {
  categoryStore.fetchCategories({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    options: options.value,
  }).then(response => {
    categories.value = response.data.categories
    totalCategory.value = response.data.totalCategories
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchCategories)

const paginationMeta = computed(() => {
  return (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    const end = Math.min(options.page * options.itemsPerPage, total)

    return `Showing ${start} to ${end} of ${total} entries`
  }
})

const deleteCategory = id => {
  categoryStore.deleteCategory(id)

  // refetch User
  fetchCategories()
}

</script>


<template>
  <div>
    <VCard class="mb-6">
      <div style=" width: 10%;margin: 1.4rem;float: inline-start;">
        Categories
      </div>
      <div style=" width: 10%;margin: 1.4rem;float: inline-end;">
        <VBtn block prepend-icon="tabler-plus" to="add">
          Add event
        </VBtn>
      </div>
    </VCard>

    <VCard class="mb-6">

      <VCardText class="d-flex flex-wrap gap-4">
        <AppSelect :model-value="options.itemsPerPage" :items="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: -1, title: 'All' },
        ]" style="width: 5rem;" @update:model-value="options.itemsPerPage = parseInt($event, 10)" />

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <AppTextField v-model="searchQuery" placeholder="Search User" density="compact" style="width: 12.5rem;" />
        </div>
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer v-model:items-per-page="options.itemsPerPage" v-model:page="options.page" :items="categories"
        :items-length="totalCategory" :headers="headers" class="text-no-wrap" @update:options="options = $event">

        <!-- Name -->
        <template #item.cname="{ item }">
          <span class="text-capitalize font-weight-medium">{{ item }}</span>
        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, totalCategory) }}
            </p>

            <VPagination v-model="options.page" :length="Math.ceil(totalCategory / options.itemsPerPage)"
              :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalCategory / options.itemsPerPage)">
              <template #prev="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                  Previous
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                  Next
                </VBtn>
              </template>
            </VPagination>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn :to="'edit/' + item.raw.id">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteCategory(item.raw.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>
  </div>
</template>
