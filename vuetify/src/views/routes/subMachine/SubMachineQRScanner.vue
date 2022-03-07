<template>
  <v-container
	id="regular-forms"
	tag="section"
  >
	<base-v-component
	  heading="QR Code Scanner"
	  link="components/forms"
	/>
	<v-row
	  justify="center"
	  align="center"
	>
	  <v-col
		cols="12"
		md="6"
	  >
		<base-material-card
		  color="purple"
		  icon="mdi-qrcode"
		  inline
		  class="px-5 py-3"
		>
		  <template v-slot:after-heading>
			<div class="display-2 font-weight-light">
			  QR Code Scanner
			</div>
		  </template>
		  <v-divider class="mt-3" />
		  <v-col>
			<div class="font-weight-bold grey--text">
			  Scan QR Code attached to the SubMachine
			</div>
			<!-- Built-in scanner -->
			<qrcode-stream
			  @decode="onDecode"
			  @init="onInit"
			/>
			<!-- File upload -->
			<div class="display-3 red--text mt-6 mb-1">
			  {{ error }}
			</div>
			<div class="font-weight-light red--text ">
<!--              Don't see anything? Upload image manually.-->
			</div>
			<qrcode-capture
			  @decode="onDecode"
			/>
		  </v-col>
		</base-material-card>
	  </v-col>
	</v-row>
  </v-container>
</template>

<script>
export default {
	name: 'SubMachineQRScanner',
	data: function () {
		return {
			result: '',
			error: '',
		}
	},
	methods: {
		onDecode (result) {
			if (result) {
				// Push to route for submachine (this can be changed for other thing if needed)
				return this.$axios({
				  url: '/graphql',
				  method: 'POST',
				  data: {
					query: `{
						machine(id:"${result}"){
						  id
						}
					  }`,
				  },
				}).then(({ data }) => {
				  this.$router.push({ name: 'MachineMachineFormAction', params: { id: data.data.machine.id, action: 'modify' } })
				}).catch(() => (this.error = 'QR code does not match any Machine'))
			} else {
				this.error = 'Unreadable QR Code. Please try again.'
			}
		},

		async onInit (promise) {
		try {
			await promise
		} catch (error) {
			if (error.name === 'NotAllowedError') {
			this.error = 'ERROR: you need to grant camera access permisson'
			} else if (error.name === 'NotFoundError') {
			this.error = 'ERROR: no camera on this device'
			} else if (error.name === 'NotSupportedError') {
			this.error = 'ERROR: secure context required (HTTPS, localhost)'
			} else if (error.name === 'NotReadableError') {
			this.error = 'ERROR: is the camera already in use?'
			} else if (error.name === 'OverconstrainedError') {
			this.error = 'ERROR: installed cameras are not suitable'
			} else if (error.name === 'StreamApiNotSupportedError') {
			this.error = 'ERROR: Stream API is not supported in this browser'
			}
		}
		},
	},
}
</script>
