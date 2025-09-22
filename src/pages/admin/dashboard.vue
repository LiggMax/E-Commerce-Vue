<template>
  <AdminLayout>
    <!-- 页面标题 -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">仪表盘</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          欢迎回来，这是您的管理概览
        </p>
      </div>
      <v-chip color="success" variant="tonal">
        <v-icon start>mdi-check-circle</v-icon>
        系统正常
      </v-chip>
    </div>

    <!-- 统计卡片 -->
    <v-row class="mb-6">
      <v-col
        v-for="stat in statsCards"
        :key="stat.title"
        cols="12"
        md="3"
        sm="6"
      >
        <v-card class="stat-card" height="120">
          <v-card-text class="d-flex align-center">
            <div class="flex-grow-1">
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                {{ stat.title }}
              </div>
              <div class="text-h4 font-weight-bold mb-1">
                {{ stat.value }}
              </div>
              <div class="d-flex align-center">
                <v-icon
                  class="mr-1"
                  :color="stat.trend === 'up' ? 'success' : 'error'"
                  size="small"
                >
                  {{ stat.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down' }}
                </v-icon>
                <span
                  class="text-caption"
                  :class="stat.trend === 'up' ? 'text-success' : 'text-error'"
                >
                  {{ stat.change }}
                </span>
              </div>
            </div>
            <v-avatar
              :color="stat.color"
              size="48"
              variant="tonal"
            >
              <v-icon :icon="stat.icon" />
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 主要内容区域 -->
    <v-row>
      <!-- 左侧内容 -->
      <v-col cols="12" md="8">
        <!-- 最近活动 -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-clock-outline</v-icon>
            最近活动
          </v-card-title>
          <v-card-text>
            <v-timeline align="start" density="compact">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <template #icon>
                  <v-icon :icon="activity.icon" size="small" />
                </template>
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <div class="text-body-2 font-weight-medium">
                      {{ activity.title }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ activity.description }}
                    </div>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ activity.time }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右侧内容 -->
      <v-col cols="12" md="4">
        <!-- 快速操作 -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            快速操作
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="action in quickActions"
                :key="action.title"
                :prepend-icon="action.icon"
                :subtitle="action.subtitle"
                :title="action.title"
                @click="handleQuickAction(action.action)"
              />
            </v-list>
          </v-card-text>
        </v-card>

        <!-- 系统状态 -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-server</v-icon>
            系统状态
          </v-card-title>
          <v-card-text>
            <div class="mb-3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">CPU使用率</span>
                <span class="text-body-2">45%</span>
              </div>
              <v-progress-linear
                color="primary"
                height="6"
                model-value="45"
                rounded
              />
            </div>
            <div class="mb-3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">内存使用</span>
                <span class="text-body-2">68%</span>
              </div>
              <v-progress-linear
                color="warning"
                height="6"
                model-value="68"
                rounded
              />
            </div>
            <div>
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">存储空间</span>
                <span class="text-body-2">82%</span>
              </div>
              <v-progress-linear
                color="error"
                height="6"
                model-value="82"
                rounded
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </AdminLayout>
</template>

<script lang="ts" setup>
// 统计数据
  const statsCards = [
    {
      title: '总用户数',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      color: 'primary',
      icon: 'mdi-account-group',
    },
    {
      title: '今日订单',
      value: '89',
      change: '+5%',
      trend: 'up',
      color: 'success',
      icon: 'mdi-shopping',
    },
    {
      title: '总收入',
      value: '¥45,678',
      change: '+18%',
      trend: 'up',
      color: 'info',
      icon: 'mdi-currency-cny',
    },
    {
      title: '系统负载',
      value: '68%',
      change: '-3%',
      trend: 'down',
      color: 'warning',
      icon: 'mdi-server',
    },
  ]

  // 最近活动
  const recentActivities = [
    {
      id: 1,
      title: '新用户注册',
      description: '用户 张三 完成注册',
      time: '2分钟前',
      color: 'success',
      icon: 'mdi-account-plus',
    },
    {
      id: 2,
      title: '订单创建',
      description: '订单 #12345 已创建',
      time: '5分钟前',
      color: 'primary',
      icon: 'mdi-shopping',
    },
    {
      id: 3,
      title: '系统更新',
      description: '系统已更新到最新版本',
      time: '1小时前',
      color: 'info',
      icon: 'mdi-update',
    },
    {
      id: 4,
      title: '数据备份',
      description: '定时备份任务完成',
      time: '3小时前',
      color: 'success',
      icon: 'mdi-backup-restore',
    },
  ]

  // 快速操作
  const quickActions = [
    {
      title: '创建用户',
      subtitle: '添加新的系统用户',
      icon: 'mdi-account-plus',
      action: 'create-user',
    },
    {
      title: '查看订单',
      subtitle: '管理所有订单',
      icon: 'mdi-shopping',
      action: 'view-orders',
    },
    {
      title: '系统设置',
      subtitle: '配置系统参数',
      icon: 'mdi-cog',
      action: 'settings',
    },
    {
      title: '数据导出',
      subtitle: '导出统计数据',
      icon: 'mdi-download',
      action: 'export-data',
    },
  ]

  // 处理快速操作
  function handleQuickAction (action: string) {
    console.log('执行快速操作:', action)
  // 这里可以根据action类型执行相应的操作
  }
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

</style>
