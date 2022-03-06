<template>
  <div />
</template>

<script>
    export default {
        name: 'PagesLogout',
        created () {
            // Remove token from store and push to login page
            this.$store.dispatch('auth/logout');
            this.$router.push('/authentication/choose')
        },
    }
</script>
