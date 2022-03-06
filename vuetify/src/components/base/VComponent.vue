<template>
  <section class="mb-12 text-center">
    <h1
      class="font-weight-light mb-2 headline"
    />
    <span
      class="font-weight-light subtitle-1"
    >
      {{ subheading }}
    </span>
  </section>
</template>

<script>
  export default {
    name: 'VComponent',

    props: {
      heading: {
        type: String,
        default: '',
      },
      subheading: {
        type: String,
        default: '',
      },
      link: {
        type: String,
        default: '',
      },
    },
  }
</script>
