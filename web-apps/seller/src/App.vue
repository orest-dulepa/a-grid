<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import '@/styles/fonts';
@import '@/styles/form';
@import '@/styles/typography';
@import '@/styles/highcharts';

#app,
body,
input,
button,
textarea {
  margin: 0;
  font-family: 'Inter', 'Roboto', 'Arial', sans-serif;
  letter-spacing: -0.02em;
}

body {
  display: flex;
  flex-flow: column;
}

code {
  font-family: 'SFMono', 'Andale Mono', monospace;
}
</style>
