<template>
  <v-footer
    id="pages-core-footer"
    absolute
    color="transparent"
    dark
  >
    <v-container>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center"
          cols="3"
        >
          <a
            :href="link.href"
            class="mr-0"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-col
          cols="9"
        >
<!--          <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">-->
<!--            &copy; 2020, operated by <a-->
<!--              href="https://lapissoft.co.uk"-->
<!--              class="white&#45;&#45;text"-->
<!--            >Searu Uk Ltd</a>-->
<!--          </div>-->
          <div class="body-1 font-weight-light pt-3 pb-3  pt-md-0 text-center">
            &copy; 2020, operated by <a
            class="white--text"
          >Searu Uk Ltd</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'PagesCoreFooter',

    data: () => ({
      links: [
        {
          href: '#',
          text: 'Licenses',
        },
      ],
    }),
  }
</script>

<style lang="sass">
  #pages-core-footer
    a
      color: #FFFFFF
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
