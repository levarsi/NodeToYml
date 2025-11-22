<script setup>
import { ref, computed } from "vue";
import {
  NConfigProvider,
  NGlobalStyle,
  NCard,
  NInput,
  NButton,
  NUpload,
  NUploadDragger,
  NIcon,
  NSpace,
  NText,
  NMessageProvider,
  useMessage,
  NSpin,
  NLayout,
  NLayoutContent,
  darkTheme,
  NAlert,
} from "naive-ui";
import {
  Zap,
  Copy,
  Download,
  Upload,
  FileText,
  Check,
  Shield,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-vue-next";
import { parseLinks, generateClashConfig } from "./utils/converter";

const input = ref("");
const output = ref("");
const error = ref("");
const isConverting = ref(false);
const copied = ref(false);

const themeOverrides = {
  common: {
    primaryColor: "#6366f1",
    primaryColorHover: "#818cf8",
    primaryColorPressed: "#4f46e5",
  },
  Card: {
    borderRadius: "16px",
    color: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  Input: {
    borderRadius: "12px",
    color: "rgba(0, 0, 0, 0.2)",
    textColor: "#e2e8f0",
  },
};

const handleConvert = () => {
  error.value = "";
  isConverting.value = true;

  setTimeout(() => {
    try {
      const proxies = parseLinks(input.value);
      if (proxies.length === 0) {
        error.value = "未找到有效的节点链接";
        isConverting.value = false;
        return;
      }
      const yamlConfig = generateClashConfig(proxies);
      output.value = yamlConfig;
    } catch (e) {
      error.value = "转换失败: " + e.message;
    }
    isConverting.value = false;
  }, 600);
};

const handleCopy = () => {
  navigator.clipboard.writeText(output.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const handleDownload = () => {
  const blob = new Blob([output.value], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clash_config.yaml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const handleUploadChange = (data) => {
  const file = data.file.file;
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    input.value = event.target.result;
  };
  reader.readAsText(file);
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <div class="app-container">
        <!-- Background Effects -->
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>

        <div class="content-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="title-row">
              <div class="logo-container">
                <n-icon size="32" color="#818cf8">
                  <Sparkles />
                </n-icon>
              </div>
              <h1 class="title">NodeToYml</h1>
            </div>
            <p class="subtitle">
              下一代节点转换工具。支持
              <span class="highlight"
                >vMess, vLess, Trojan, SS, Tuic, Hysteria2</span
              >。
            </p>
          </div>

          <div class="main-grid">
            <!-- Input Section -->
            <div class="section input-section">
              <n-card :bordered="true" class="glass-card">
                <template #header>
                  <div class="card-header">
                    <n-icon size="20" color="#818cf8"><Activity /></n-icon>
                    <span>输入节点链接</span>
                  </div>
                </template>

                <n-upload
                  directory-dnd
                  :show-file-list="false"
                  @change="handleUploadChange"
                  accept=".txt,.conf"
                  class="upload-area"
                >
                  <n-upload-dragger class="dragger">
                    <div class="textarea-wrapper" @click.stop>
                      <n-input
                        v-model:value="input"
                        type="textarea"
                        placeholder="在此粘贴节点链接...&#10;vmess://...&#10;vless://...&#10;hysteria2://...&#10;&#10;或者将文件拖拽至此..."
                        :autosize="{ minRows: 12, maxRows: 12 }"
                        class="custom-textarea"
                      />
                    </div>
                    <div class="upload-hint">
                      <n-icon size="16"><Upload /></n-icon>
                      <span>拖拽文件或点击上传</span>
                    </div>
                  </n-upload-dragger>
                </n-upload>

                <div class="action-area">
                  <n-button
                    type="primary"
                    size="large"
                    block
                    :loading="isConverting"
                    @click="handleConvert"
                    class="convert-btn"
                  >
                    <template #icon>
                      <n-icon><Zap /></n-icon>
                    </template>
                    立即转换
                  </n-button>
                </div>

                <n-alert
                  v-if="error"
                  type="error"
                  class="mt-4"
                  :show-icon="true"
                >
                  {{ error }}
                </n-alert>
              </n-card>
            </div>

            <!-- Arrow (Desktop) -->
            <div class="arrow-container">
              <n-icon size="48" color="rgba(255,255,255,0.2)"
                ><ArrowRight
              /></n-icon>
            </div>

            <!-- Output Section -->
            <div class="section output-section">
              <n-card :bordered="true" class="glass-card">
                <template #header>
                  <div class="card-header">
                    <n-icon size="20" color="#34d399"><FileText /></n-icon>
                    <span>转换结果</span>
                  </div>
                </template>
                <template #header-extra>
                  <n-space>
                    <n-button
                      size="small"
                      secondary
                      type="primary"
                      @click="handleCopy"
                      :disabled="!output"
                    >
                      <template #icon>
                        <n-icon :color="copied ? '#34d399' : undefined">
                          <Check v-if="copied" />
                          <Copy v-else />
                        </n-icon>
                      </template>
                      {{ copied ? "已复制" : "复制" }}
                    </n-button>
                    <n-button
                      size="small"
                      secondary
                      type="success"
                      @click="handleDownload"
                      :disabled="!output"
                    >
                      <template #icon>
                        <n-icon><Download /></n-icon>
                      </template>
                      下载
                    </n-button>
                  </n-space>
                </template>

                <div class="output-wrapper">
                  <n-input
                    v-model:value="output"
                    type="textarea"
                    placeholder="# 等待转换..."
                    readonly
                    :autosize="{ minRows: 16, maxRows: 16 }"
                    class="output-textarea"
                  />
                  <div v-if="!output" class="empty-state">
                    <n-icon size="48" color="rgba(255,255,255,0.1)"
                      ><FileText
                    /></n-icon>
                    <p>结果将显示在这里</p>
                  </div>
                </div>
              </n-card>
            </div>
          </div>

          <footer class="footer">
            <p>
              &copy; {{ new Date().getFullYear() }} NodeToYml. Crafted with ❤
              for better connectivity.
            </p>
          </footer>
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.app-container {
  width: 100vw;
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e1b4b, #0f172a, #1e1b4b);
  color: #f1f5f9;
  position: relative;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  z-index: 0;
  animation: float 10s infinite ease-in-out;
}

.orb-1 {
  top: -10%;
  left: -10%;
  width: 40vw;
  height: 40vw;
  background: #4f46e5;
}

.orb-2 {
  bottom: -10%;
  right: -10%;
  width: 40vw;
  height: 40vw;
  background: #2563eb;
  animation-delay: -5s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 100%;
  margin: 0;
  padding: 2rem 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.logo-container {
  display: inline-flex;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(to right, #c7d2fe, #ffffff, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.highlight {
  color: #818cf8;
  font-weight: 500;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  flex-grow: 1;
  align-items: start;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr auto 1fr;
  }
}

.glass-card {
  backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.6) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.dragger {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.textarea-wrapper {
  position: relative;
  z-index: 2;
}

.custom-textarea {
  text-align: left;
}

.custom-textarea :deep(.n-input__textarea-el) {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: left;
}

.upload-hint {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 20px;
  pointer-events: none;
  backdrop-filter: blur(4px);
}

.action-area {
  margin-top: 1.5rem;
}

.convert-btn {
  height: 56px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 16px;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.convert-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  background: linear-gradient(135deg, #4338ca, #2563eb);
}

.arrow-container {
  display: none;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  animation: pulse 2s infinite;
}

@media (min-width: 1024px) {
  .arrow-container {
    display: flex;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.output-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.output-textarea {
  background: transparent !important;
}

.output-textarea :deep(.n-input__textarea-el) {
  color: #34d399 !important;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85rem;
  text-align: left;
}

.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

.footer {
  text-align: center;
  margin-top: 4rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
}

.mt-4 {
  margin-top: 1rem;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
