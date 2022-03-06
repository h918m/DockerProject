import axios from '@/plugins/axios-interceptor'

function getNames(data) {
  let name = "";
  for(let item of data){
    name += item.name + ' ,'
  }
  return name.slice(0, -1);
}

export default {
  methods: {
    exportTable(fileName) {
      this.loading = true;
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';

      // let newData = this.data.slice(0);
      let newData = [];
      newData = JSON.parse(JSON.stringify(this.data));
      // Adjust fields to fit the excel sheet template
      switch (fileName) {
        case 'Breakdown Records':
          for (let x = 0; x < newData.length; x += 1) {
            newData[x].startDateTime = newData[x].workTime.startDateTime;
            newData[x].endDateTime = newData[x].workTime.endDateTime;
            if (newData[x].subMachine) {
              newData[x].subMachine = newData[x].subMachine.id
            }
            if (newData[x].user) {
              newData[x].user = newData[x].user.id
            }
            delete newData[x].workTime
          }
          break;
        case 'Planned Maintenances':
          for (let x = 0; x < newData.length; x += 1) {
            if (newData[x].users) {
              newData[x].users = getNames(newData[x].users);
            }
            if (newData[x].machine) {
              newData[x].machine = newData[x].machine.name
            }
          }
          break;
        case 'Planned Maintenance Time Functions':
          for (let x = 0; x < newData.length; x += 1) {
            if (newData[x].machine) {
              newData[x].machine = newData[x].machine.name
            }
            if (newData[x].users && newData[x].users.length > 0) {
              let data = newData[x].users.slice(0);
              newData[x].users = getNames(data);
            }
          }
          break;
        case 'Sensor Reading':
          for (let x = 0; x < newData.length; x += 1) {
            delete newData[x].formattedData;
          }
          break;
        default:
          console.error('Not matching any pattern.');
          this.loading = false;
          return null
      }

      fileName += ` ${this.$moment().format()}`;

      const ws = this.$xlsx.utils.json_to_sheet(newData);
      const wb = {Sheets: {data: ws}, SheetNames: ['data']};
      const excelBuffer = this.$xlsx.write(wb, {bookType: 'xlsx', type: 'array'});
      const data = new Blob([excelBuffer], {type: fileType});
      this.$filesaver.saveAs(data, fileName + fileExtension);
      this.loading = false
    },
    getTemplate(fileName) {
      this.loading = true;
      if (!this.template) {
        console.error('No template defined for this model. Create this.template object and define structure');
        return null
      }
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      const newFileName = fileName + ' Template';
      const ws = this.$xlsx.utils.json_to_sheet([this.template]);
      const wb = {Sheets: {data: ws}, SheetNames: ['data']};
      const excelBuffer = this.$xlsx.write(wb, {bookType: 'xlsx', type: 'array'});
      const data = new Blob([excelBuffer], {type: fileType});
      this.$filesaver.saveAs(data, newFileName + fileExtension);
      this.loading = false
    },
    importTable(val, apiUrl) {
      this.loading = true;
      this.file = val[0];
      const XLSX = require('xlsx');
      var reader = new FileReader();
      reader.onload = function (e) {
        // pre-process data
        var binary = '';
        var bytes = new Uint8Array(e.target.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }

        /* read workbook */
        var wb = XLSX.read(binary, {type: 'binary'});
        var sheetNameList = wb.SheetNames;
        sheetNameList.forEach(function (y) {
          var worksheet = wb.Sheets[y];
          var headers = {};
          var data = [];
          for (const z in worksheet) {
            if (z[0] === '!') continue;
            // parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
              if (!isNaN(z[i])) {
                tt = i;
                break
              }
            }
            var col = z.substring(0, tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            // store header names
            if (row === 1 && value) {
              headers[col] = value;
              continue
            }

            if (!data[row]) data[row] = {};
            data[row][headers[col]] = value
          }
          // drop those first two rows which are empty
          data.shift();
          data.shift();

          // Sanitize data to remove fragile data
          for (let x = 0; x < data.length; x += 1) {
            delete data[x].id;
            delete data[x].createdAt;
            delete data[x].updatedAt
          }

          switch (apiUrl) {
            case '/failure-records-bulk':
              for (let x = 0; x < data.length; x += 1) {
                data[x].workTime = {
                  startDateTime: data[x].startDateTime,
                  endDateTime: data[x].endDateTime,
                };
                delete data[x].startDateTime;
                delete data[x].endDateTime
              }
              break
          }

          axios.post(apiUrl, data);
          this.loading = false
        })
      };

      reader.readAsArrayBuffer(this.file);
      this.loading = false
    },
  },
}
