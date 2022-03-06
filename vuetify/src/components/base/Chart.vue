<script>
  import { Line } from "vue-chartjs";
  export default {
    extends: Line,
    name: 'Chart',
    props: {
      data: {
        default : []
      },
      label: {
        default: 'label',
        type: String
      }
    },
    watch: {
      data: function (){
        let chartData = {
          labels: [],
          datasets: [
            {
              label: this.label,
              backgroundColor: 'rgba(255,215,250,0.5)',
              borderColor: '#e91e63',
              data: []
            }
          ]
        };
        for (let i = 0; i < this.data.length; i++) {
          chartData.labels.push(this.data[i].date);
          chartData.datasets[0].data.push(this.data[i].views);
        }
        this.renderChart(chartData, {
          responsive: true,
          maintainAspectRatio: false
        });
      }
    },

    mounted() {
      let chartData = {
        labels: [],
        datasets: [
          {
            label: this.label,
            backgroundColor: 'rgba(255,215,250,0.5)',
            borderColor: '#e91e63',
            data: []
          }
        ]
      };
      for (let i = 0; i < this.data.length; i++) {
        chartData.labels.push(this.data[i].date);
        chartData.datasets[0].data.push(this.data[i].views);
      }
      this.renderChart(chartData, {
        responsive: true,
        maintainAspectRatio: false
      });
    },
  }
</script>
