<template>
  <div>
    <v-row
      align="end"
      justify="center"
      class="svg-gauge-slot-row"
    >
      <h1
        :class="[bindClass, `${color}--text`]"
      >
        {{ value }}<span class="subtitle-2 align-to-top">{{ unitSymbol }}</span>
      </h1>
    </v-row>
  </div>
</template>

<script>
    export default {
        props: {
            bindClass: {
                default: '',
                type: String,
            },
            value: {
                default: -100000,
                type: Number,
                required: true,
            },
            unitSymbol: {
              default: '',
              type: String,
            },
            color: {
              default: 'yellow',
              type: String,
              required: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
.align-to-top{
  vertical-align: text-top;
}

.svg-gauge-slot-row{
    height: 100%;
}
div{
    height: 100%;
}
</style>
