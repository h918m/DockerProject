<script>
  import { Line } from "vue-chartjs";
  export default {
    extends: Line,
    name: 'LineChart',
    props: {
      data: {
        default : []
      },
      minimum: {
        default: 0
      },
      maximum: {
        default: 100
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
              backgroundColor: 'rgba(255,215,250,0)',
              borderColor: '#011ae9',
              data: []
            },
            {
              label: 'Minimum',
              backgroundColor: 'rgba(255,215,250,0)',
              borderColor: '#e91218',
              data: []
            },
            {
              label: 'Maximum',
              backgroundColor: 'rgba(255,215,250,0)',
              borderColor: '#e91218',
              data: []
            }
          ]
        };
        for (let i = 0; i < this.data.length; i++) {
          chartData.labels.push(this.data[i].date);
          chartData.datasets[0].data.push(this.data[i].views);
          chartData.datasets[1].data.push(this.minimum);
          chartData.datasets[2].data.push(this.maximum);
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
            backgroundColor: 'rgba(255,215,250,0)',
            borderColor: '#011ae9',
            data: []
          },
          {
            label: 'Minimum',
            backgroundColor: 'rgba(255,215,250,0)',
            borderColor: '#e91218',
            data: []
          },
          {
            label: 'Maximum',
            backgroundColor: 'rgba(255,215,250,0)',
            borderColor: '#e91218',
            data: []
          }
        ]
      };
      for (let i = 0; i < this.data.length; i++) {
        chartData.labels.push(this.data[i].date);
        chartData.datasets[0].data.push(this.data[i].views);
        chartData.datasets[1].data.push(this.minimum);
        chartData.datasets[2].data.push(this.maximum);
      }
      this.renderChart(chartData, {
        responsive: true,
        maintainAspectRatio: false
      });
    },
  }
</script>
