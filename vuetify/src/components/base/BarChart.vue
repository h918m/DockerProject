<script>
  import { Bar } from "vue-chartjs";

  export default {
    extends: Bar,
    name: "BarChart",
    props: ["data"],
    watch: {
      data : function() {
        let chartData = this.data;


        this.renderChart(chartData, {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                stacked: true
              }
            ],
            yAxes: [
              {
                stacked: true
              }
            ]
          }
        });
      }
    },
    mounted() {
      // reformat in the way the lib wants
      // let chartData = {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: "New",
      //       backgroundColor: "#f87979",
      //       data: []
      //     },
      //     {
      //       label: "Old",
      //       backgroundColor: "#c0c0c0",
      //       data: []
      //     }
      //   ]
      // };
      let chartData = this.data;


      this.renderChart(chartData, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      });
    }
  };
</script>
