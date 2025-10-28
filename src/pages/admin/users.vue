<template>
  <!-- 页面标题和操作 -->
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <h1 class="text-h4 font-weight-bold mb-2">用户管理</h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        管理系统用户信息
      </p>
    </div>
    <v-btn
      color="primary"
      prepend-icon="mdi-account-plus"
      @click="openDialog('add')"
    >
      添加用户
    </v-btn>
  </div>

  <!-- 用户列表 -->
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-group</v-icon>
        用户列表
      </div>

      <!-- 搜索 -->
      <div class="d-flex align-center ga-2">
        <v-text-field
          v-model="search"
          density="compact"
          hide-details
          placeholder="搜索用户..."
          prepend-inner-icon="mdi-magnify"
          style="width: 300px;"
          variant="outlined"
        />
      </div>
    </v-card-title>

    <v-card-text class="overflow-y-auto" style="max-height: 600px;">
      <!-- 数据表格 -->
      <v-data-table
        class="elevation-0"
        :headers="headers"
        hide-default-footer
        :items="filteredUserList"
        :items-per-page="-1"
        :loading="loading"
        :search="search"
      >
        <template #header.account="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-account</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.email="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-email</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.role="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-shield-account</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.status="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-check-circle</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.createdAt="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-calendar</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <template #header.actions="{ column }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" size="small">mdi-cog</v-icon>
            <span>{{ column.title }}</span>
          </div>
        </template>

        <!-- 用户头像 -->
        <template #item.avatar="{ item }">
          <v-avatar :color="getAvatarColor(item.account)" size="40">
            <v-img v-if="item.avatar" :src="item.avatar" />
            <span v-else class="text-h6">{{ getAvatarText(item.account) }}</span>
          </v-avatar>
        </template>

        <!-- 用户名 -->
        <template #item.account="{ item }">
          <div class="text-body-1 font-weight-medium">{{ item.account }}</div>
        </template>

        <!-- 昵称 -->
        <template #item.nickName="{ item }">
          <div class="text-body-2">{{ item.nickName }}</div>
        </template>

        <!-- 邮箱 -->
        <template #item.email="{ item }">
          <div class="text-body-2">{{ item.email || '未设置' }}</div>
        </template>

        <!-- 余额 -->
        <template #item.accountBalance="{ item }">
          <div class="text-body-2 font-weight-medium text-success">¥{{ item.accountBalance.toFixed(2) }}</div>
        </template>

        <!-- 角色 -->
        <template #item.role="{ item }">
          <v-chip :color="getRoleColor(item.role)" size="small" variant="tonal">
            {{ getRoleDisplayName(item.role) }}
          </v-chip>
        </template>

        <!-- 状态 -->
        <template #item.status="{ item }">
          <v-chip :color="(item.status === 1 || item.status === true) ? 'success' : 'error'" size="small" variant="tonal">
            <v-icon size="small" start>
              {{ (item.status === 1 || item.status === true) ? 'mdi-check' : 'mdi-close' }}
            </v-icon>
            {{ (item.status === 1 || item.status === true) ? '启用' : '禁用' }}
          </v-chip>
        </template>

        <!-- 创建时间 -->
        <template #item.createdAt="{ item }">
          <div>{{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '' }}</div>
        </template>

        <!-- 操作 -->
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                color="primary"
                icon="mdi-dots-vertical"
                size="small"
                v-bind="props"
              />
            </template>
            <v-list>
              <v-list-item @click="openDialog('edit', item)">
                <template #prepend>
                  <v-icon icon="mdi-pencil" />
                </template>
                <v-list-item-title>编辑</v-list-item-title>
              </v-list-item>
              <v-list-item @click="toggleUserStatus(item)">
                <template #prepend>
                  <v-icon :icon="(item.status === 1 || item.status === true) ? 'mdi-cancel' : 'mdi-check'" />
                </template>
                <v-list-item-title>
                  {{ (item.status === 1 || item.status === true) ? '禁用' : '启用' }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <template #prepend>
                  <v-icon icon="mdi-delete" />
                </template>
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- 分页控件 -->
    <div class="my-3 d-flex align-center justify-space-between mt-4 px-4">
      <div class="text-body-2 text-medium-emphasis">
        共 {{ pagination.totalItems }} 条记录，第 {{ pagination.page }}/{{ pagination.totalPages }} 页
      </div>

      <v-pagination
        v-model="pagination.page"
        density="compact"
        :length="pagination.totalPages"
        :total-visible="5"
        @update:model-value="handlePageChange"
      />

      <div class="d-flex align-center">
        <span class="mr-2">每页</span>
        <v-select
          v-model="pagination.pageSize"
          class="pagination-select"
          density="compact"
          hide-details
          :items="[10, 20, 50, 100]"
          style="width: 100px;"
          variant="outlined"
          @update:model-value="handlePageSizeChange"
        />
        <span class="ml-2">条</span>
      </div>
    </div>
  </v-card>

  <!-- 添加/编辑对话框 -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">{{ dialogMode === 'add' ? 'mdi-account-plus' : 'mdi-pencil' }}</v-icon>
        {{ dialogMode === 'add' ? '添加用户' : '编辑用户' }}
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            v-model="userForm.account"
            density="compact"
            label="用户名"
            placeholder="请输入用户名"
            prepend-inner-icon="mdi-account"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-text-field
            v-model="userForm.nickName"
            density="compact"
            label="昵称"
            placeholder="请输入昵称"
            prepend-inner-icon="mdi-account-circle"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-text-field
            v-model="userForm.email"
            density="compact"
            label="邮箱"
            placeholder="请输入邮箱"
            prepend-inner-icon="mdi-email"
            :rules="[rules.email]"
            variant="outlined"
          />

          <v-text-field
            v-if="dialogMode === 'add'"
            v-model="userForm.password"
            density="compact"
            label="密码"
            placeholder="请输入密码"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required, rules.password]"
            type="password"
            variant="outlined"
          />

          <v-select
            v-model="userForm.role"
            density="compact"
            :items="roleOptions"
            label="角色"
            prepend-inner-icon="mdi-shield-account"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-switch
            v-model="userForm.status"
            color="primary"
            label="启用状态"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="dialog = false"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!formValid"
          @click="handleSave"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 删除确认对话框 -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon class="mr-2" color="error">mdi-alert</v-icon>
        确认删除
      </v-card-title>
      <v-card-text>
        确定要删除用户 "{{ itemToDelete?.account }}" 吗？此操作不可恢复。
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="deleteDialog = false">
          取消
        </v-btn>
        <v-btn color="error" @click="handleDeleteConfirm">
          删除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import {
    addUser,
    deleteUserById,
    getUsers,
    toggleUserStatus as toggleUserStatusApi,
    updateUser,
  } from '@/http/admin/users.ts'
  import { useNotification } from '@/utils/notification'

  // 定义用户接口
  interface User {
    id: string
    userId: string
    nickName: string
    avatar: string
    account: string
    email: string | null
    password?: string
    role: string
    status: number | boolean
    accountBalance: number
    createdAt: string
    createTime: string
    lastLoginTime: string | null
  }

  // 响应式数据
  const dialog = ref(false)
  const loading = ref(false)
  const search = ref('')
  const dialogMode = ref<'add' | 'edit'>('add')
  const editItem = ref<User>()
  const route = useRoute()
  const router = useRouter()
  const formRef = ref()
  const formValid = ref(false)

  const { showSuccess, showError } = useNotification()

  // 用户表单
  const userForm = ref<User>({
    id: '',
    userId: '',
    nickName: '',
    avatar: '',
    account: '',
    email: '',
    password: '',
    role: 'USER',
    status: true,
    accountBalance: 0,
    createdAt: '',
    createTime: '',
    lastLoginTime: null,
  })

  // 删除相关
  const deleteDialog = ref(false)
  const itemToDelete = ref<User>()

  // 分页相关数据
  const pagination = reactive({
    page: Number.parseInt(route.query.page as string) || 1,
    pageSize: Number.parseInt(route.query.pageSize as string) || 10,
    totalItems: 0,
    totalPages: 0,
  })

  // 角色选项
  const roleOptions = [
    { title: '普通用户', value: 'USER' },
    { title: '管理员', value: 'ADMIN' },
    { title: '超级管理员', value: 'SUPER_ADMIN' },
  ]

  // 表格头部配置
  const headers = [
    { title: '头像', key: 'avatar', sortable: false, width: 80 },
    { title: '用户名', key: 'account', sortable: true, minWidth: 150 },
    { title: '昵称', key: 'nickName', sortable: true, minWidth: 150 },
    { title: '邮箱', key: 'email', sortable: true, minWidth: 200 },
    { title: '角色', key: 'role', sortable: true, minWidth: 120 },
    { title: '余额', key: 'accountBalance', sortable: true, minWidth: 100 },
    { title: '状态', key: 'status', sortable: true, minWidth: 100 },
    { title: '创建时间', key: 'createdAt', sortable: true, minWidth: 150 },
    { title: '操作', key: 'actions', sortable: false, width: 100 },
  ]

  // 用户列表
  const userList = ref<User[]>([])

  // 获取用户头像颜色
  function getAvatarColor (username: string) {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    const codePoint = username.codePointAt(0) || 0
    const index = codePoint % colors.length
    return colors[index]
  }

  // 获取头像文字
  function getAvatarText (username: string) {
    return username.slice(0, 1).toUpperCase()
  }

  // 获取角色颜色
  function getRoleColor (role: string) {
    const colorMap: Record<string, string> = {
      user: 'primary',
      USER: 'primary',
      admin: 'success',
      ADMIN: 'success',
      super_admin: 'warning',
      SUPER_ADMIN: 'warning',
    }
    return colorMap[role] || 'default'
  }

  // 获取角色显示名称
  function getRoleDisplayName (role: string) {
    const roleMap: Record<string, string> = {
      user: '普通用户',
      USER: '普通用户',
      admin: '管理员',
      ADMIN: '管理员',
      super_admin: '超级管理员',
      SUPER_ADMIN: '超级管理员',
    }
    return roleMap[role] || role
  }

  // 表单验证规则
  const rules = {
    required: (value: string) => !!value || '此字段为必填项',
    email: (value: string) => {
      if (!value) return true // 允许为空
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      return pattern.test(value) || '请输入有效的邮箱地址'
    },
    password: (value: string) => value.length >= 6 || '密码至少需要6个字符',
  }

  // 获取用户列表
  async function fetchUserList () {
    loading.value = true
    try {
      const response = await getUsers(pagination.page, pagination.pageSize)
      const userData = response.data.list || []
      pagination.totalItems = response.data.total || 0
      pagination.totalPages = response.data.pages || 1

      userList.value = userData.map((item: any) => ({
        id: item.userId,
        userId: item.userId,
        account: item.account,
        nickName: item.nickName,
        avatar: item.avatar,
        email: item.email,
        role: item.role,
        status: item.status,
        accountBalance: item.accountBalance,
        createdAt: item.createTime,
        createTime: item.createTime,
        lastLoginTime: item.lastLoginTime,
      }))
    } catch (error) {
      console.error('获取用户数据失败:', error)
      showError('获取用户数据失败')
    } finally {
      loading.value = false
    }
  }

  // 页码变化处理
  function handlePageChange (newPage: number) {
    pagination.page = newPage
    router.push({
      query: {
        ...route.query,
        page: newPage.toString(),
        pageSize: pagination.pageSize.toString(),
      },
    })
  }

  // 每页条数变化处理
  function handlePageSizeChange (newSize: number) {
    pagination.pageSize = newSize
    pagination.page = 1
    router.push({
      query: {
        ...route.query,
        pageSize: newSize.toString(),
        page: '1',
      },
    })
  }

  const filteredUserList = computed(() => userList.value)

  // 打开对话框
  function openDialog (mode: 'add' | 'edit', item?: User) {
    dialogMode.value = mode
    if (mode === 'add') {
      userForm.value = {
        id: '',
        userId: '',
        nickName: '',
        avatar: '',
        account: '',
        email: '',
        password: '',
        role: 'USER',
        status: true,
        accountBalance: 0,
        createdAt: '',
        createTime: '',
        lastLoginTime: null,
      }
    } else {
      editItem.value = item
      if (item) {
        userForm.value = { ...item }
      }
    }
    dialog.value = true
  }

  // 处理保存
  async function handleSave () {
    try {
      if (dialogMode.value === 'add') {
        await addUser(userForm.value)
        showSuccess('用户添加成功')
      } else {
        await updateUser(userForm.value)
        showSuccess('用户更新成功')
      }
      dialog.value = false
      await fetchUserList()
    } catch (error) {
      console.error('保存失败:', error)
      showError('保存失败')
    }
  }

  // 打开删除对话框
  function openDeleteDialog (item: User) {
    itemToDelete.value = item
    deleteDialog.value = true
  }

  // 处理删除确认
  async function handleDeleteConfirm () {
    if (!itemToDelete.value) return

    try {
      await deleteUserById(itemToDelete.value.id)
      userList.value = userList.value.filter(i => i.id !== itemToDelete.value!.id)
      showSuccess(`${itemToDelete.value.account}删除成功`)
      deleteDialog.value = false
    } catch (error) {
      console.error('删除失败:', error)
      showError('删除失败')
    }
  }

  // 切换用户状态
  async function toggleUserStatus (item: User) {
    try {
      const newStatus = (item.status === 1 || item.status === true) ? 0 : 1
      await toggleUserStatusApi(item.userId || item.id, newStatus === 1)
      item.status = newStatus
      showSuccess(`${newStatus === 1 ? '启用' : '禁用'}成功`)
    } catch (error) {
      console.error('操作失败:', error)
      showError('操作失败')
    }
  }

  onMounted(() => {
    fetchUserList()
  })

  // 监听路由变化
  watch(
    () => route.query,
    newQuery => {
      if (newQuery.page) {
        pagination.page = Number.parseInt(newQuery.page as string)
      }
      if (newQuery.pageSize) {
        pagination.pageSize = Number.parseInt(newQuery.pageSize as string)
      }
      fetchUserList()
    },
    { immediate: true },
  )
</script>

<style scoped>
.pagination-select {
  max-width: 100px;
}
</style>
