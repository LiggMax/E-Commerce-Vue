<template>
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
      系统运行({{ ((systemStatus.systemUptime) / (24 * 60 * 60)).toFixed(2) }})天
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

  <!-- 网络波动图 -->
  <v-card class="mb-6">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-line</v-icon>
      网络速度监控
    </v-card-title>
    <v-card-text>
      <div id="networkChart" style="height: 300px;" />
    </v-card-text>
  </v-card>

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
              <span class="text-body-2">{{ systemStatus.cpuUsage.toFixed(1) }}%</span>
            </div>
            <div class="text-caption d-flex align-center text-medium-emphasis mb-1">
              <span>{{ systemStatus.cpuModel }}</span>
              <span v-if="systemStatus.cpuTemperature > 0" class="ml-2">({{ systemStatus.cpuTemperature }}°C)</span>
            </div>
            <v-progress-linear
              color="primary"
              height="6"
              :model-value="systemStatus.cpuUsage"
              rounded
            />
          </div>
          <div class="mb-3">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">内存使用</span>
              <span class="text-body-2">{{ memoryUsagePercent.toFixed(1) }}%</span>
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ usedMemoryGB.toFixed(2) }}GB / {{ totalMemoryGB.toFixed(2) }}GB
            </div>
            <v-progress-linear
              color="warning"
              height="6"
              :model-value="memoryUsagePercent"
              rounded
            />
          </div>
          <div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">存储空间</span>
              <span class="text-body-2">{{ diskUsagePercent.toFixed(1) }}%</span>
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ usedDiskGB.toFixed(2) }}GB / {{ totalDiskGB.toFixed(2) }}GB
            </div>
            <v-progress-linear
              color="error"
              height="6"
              :model-value="diskUsagePercent"
              rounded
            />
          </div>

          <!-- 网络接口信息 -->
          <v-divider class="my-3" />
          <div class="text-body-2 font-weight-medium mb-2">网络接口</div>
          <div
            v-for="(network, index) in systemStatus.networkInfo"
            :key="index"
            class="mb-3"
          >
            <div class="d-flex align-center mb-1">
              <v-icon class="mr-1" size="small">mdi-network</v-icon>
              <span class="text-body-2 font-weight-medium">{{ network.name }}</span>
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              <div>MAC: {{ network.macAddr }}</div>
              <div v-if="network.ipv4Addr && network.ipv4Addr.length > 0">
                IP: {{ network.ipv4Addr.join(', ') }}
              </div>
              <div class="d-flex justify-space-between mt-1">
                <span>已上传:{{ formatBytes(network.bytesSent) }}</span>
                <span>已下载:{{ formatBytes(network.bytesRecv) }}</span>
              </div>
              <div class="d-flex justify-space-between mt-1">
                <span class="text-success">⬆ {{ formatSpeed(network.uploadSpeed) }}</span>
                <span class="text-primary">⬇ {{ formatSpeed(network.downloadSpeed) }}</span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts'
  import { getSystemInfoService } from '@/http/admin/dashboard.ts'
  import { getSystemStatusServer } from '@/http/admin/event.ts'

  const systemInfo = ref({
    userCount: 0,
    todayOrderCount: 0,
    orderTotalAmount: 0,
  })

  const statsCards = computed(() => [
    {
      title: '总用户数',
      value: systemInfo.value?.userCount ?? 0,
      change: '+12%',
      trend: 'up',
      color: 'primary',
      icon: 'mdi-account-group',
    },
    {
      title: '今日订单',
      value: systemInfo.value?.todayOrderCount ?? 0,
      change: '+5%',
      trend: 'up',
      color: 'success',
      icon: 'mdi-shopping',
    },
    {
      title: '总收入',
      value: `¥${(systemInfo.value?.orderTotalAmount ?? 0).toFixed(2)}`,
      change: '+18%',
      trend: 'up',
      color: 'info',
      icon: 'mdi-currency-cny',
    },
    {
      title: '系统负载',
      value: `${systemStatus.value.cpuUsage.toFixed(0)}%`,
      change: '-3%',
      trend: 'down',
      color: 'warning',
      icon: 'mdi-server',
    },
  ])

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

  // 获取系统信息
  async function getSystemInfo () {
    await getSystemInfoService().then(response => {
      systemInfo.value = response.data
    })
  }

  // 系统状态响应式数据
  const systemStatus = ref({
    systemUptime: 0,
    cpuUsage: 0,
    cpuModel: '',
    cpuTemperature: 0,
    totalMemory: 0,
    usedMemory: 0,
    totalDisk: 0,
    usedDisk: 0,
    networkInfo: [] as Array<{
      name: string
      macAddr: string
      ipv4Addr: string[]
      bytesSent: number
      bytesRecv: number
      uploadSpeed: number
      downloadSpeed: number
    }>,
  })

  // 计算内存使用率（百分比）
  const memoryUsagePercent = computed(() => {
    if (systemStatus.value.totalMemory === 0) return 0
    return (systemStatus.value.usedMemory / systemStatus.value.totalMemory) * 100
  })

  // 计算磁盘使用率（百分比）
  const diskUsagePercent = computed(() => {
    if (systemStatus.value.totalDisk === 0) return 0
    return (systemStatus.value.usedDisk / systemStatus.value.totalDisk) * 100
  })

  // 内存GB单位换算
  const totalMemoryGB = computed(() => systemStatus.value.totalMemory)
  const usedMemoryGB = computed(() => systemStatus.value.usedMemory)

  // 磁盘GB单位换算
  const totalDiskGB = computed(() => systemStatus.value.totalDisk)
  const usedDiskGB = computed(() => systemStatus.value.usedDisk)

  // 格式化网络流量大小
  function formatBytes (bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  // 格式化网络速度 (B/s)
  function formatSpeed (bytesPerSecond: number): string {
    if (bytesPerSecond === 0) return '0 B/s'
    const k = 1024
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
    return `${(bytesPerSecond / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  // 关闭SSE连接的函数
  let closeSSE: (() => void) | null = null

  // ECharts 图表实例
  let networkChart: echarts.ECharts | null = null

  // 网络速度历史数据（保存最近的数据点）
  const networkHistory = ref<Array<{ time: string, upload: number, download: number }>>([])
  const maxDataPoints = 50 // 最多保存50个数据点

  // 初始化网络图表
  function initNetworkChart () {
    const chartDom = document.querySelector('#networkChart')
    if (!chartDom) return

    networkChart = echarts.init(chartDom as HTMLElement)

    const option = {
      title: {
        text: '实时网络速度',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const upload = params.find((p: any) => p.seriesName === '上传速度')
          const download = params.find((p: any) => p.seriesName === '下载速度')
          return `
            <div>${params[0].axisValue}</div>
            <div>${upload ? `上传: ${formatSpeed(upload.value)}` : ''}</div>
            <div>${download ? `下载: ${formatSpeed(download.value)}` : ''}</div>
          `
        },
      },
      legend: {
        data: ['上传速度', '下载速度'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: 'value',
        name: '速度 (B/s)',
        axisLabel: {
          formatter: (value: number) => formatSpeed(value),
        },
      },
      series: [
        {
          name: '上传速度',
          type: 'line',
          smooth: true,
          data: [],
          itemStyle: {
            color: '#4caf50',
          },
        },
        {
          name: '下载速度',
          type: 'line',
          smooth: true,
          data: [],
          itemStyle: {
            color: '#2196f3',
          },
        },
      ],
    }

    networkChart.setOption(option)
  }

  // 更新网络图表数据
  function updateNetworkChart (uploadSpeed: number, downloadSpeed: number) {
    if (!networkChart) return

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 添加新数据
    networkHistory.value.push({
      time: timeStr,
      upload: uploadSpeed,
      download: downloadSpeed,
    })

    // 保持最多maxDataPoints个数据点
    if (networkHistory.value.length > maxDataPoints) {
      networkHistory.value.shift()
    }

    // 更新图表
    const times = networkHistory.value.map(d => d.time)
    const uploadData = networkHistory.value.map(d => d.upload)
    const downloadData = networkHistory.value.map(d => d.download)

    networkChart.setOption({
      xAxis: {
        data: times,
      },
      series: [
        {
          data: uploadData,
        },
        {
          data: downloadData,
        },
      ],
    })
  }

  // 处理快速操作
  function handleQuickAction (action: string) {
    console.log('执行快速操作:', action)
  // 这里可以根据action类型执行相应的操作
  }

  onMounted(() => {
    // 初始化图表
    nextTick(() => {
      initNetworkChart()
    })

    // 启动SSE连接
    closeSSE = getSystemStatusServer(data => {
      systemStatus.value = data

      // 计算所有网络接口的总速度
      if (data.networkInfo && data.networkInfo.length > 0) {
        const totalUploadSpeed = data.networkInfo.reduce((sum, network) => sum + network.uploadSpeed, 0)
        const totalDownloadSpeed = data.networkInfo.reduce((sum, network) => sum + network.downloadSpeed, 0)
        updateNetworkChart(totalUploadSpeed, totalDownloadSpeed)
      }
    })
    getSystemInfo()
  })

  onBeforeUnmount(() => {
    // 组件卸载时关闭SSE连接
    if (closeSSE) {
      closeSSE()
    }

    // 销毁图表
    if (networkChart) {
      networkChart.dispose()
    }
  })
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

</style>
