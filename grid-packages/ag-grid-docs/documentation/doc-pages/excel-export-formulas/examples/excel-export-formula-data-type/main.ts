import { Grid, GridOptions } from '@ag-grid-community/core'

const gridOptions: GridOptions = {
  columnDefs: [
    { field: 'firstName' },
    { field: 'lastName' },
    {
      headerName: 'Full Name',
      colId: 'fullName',
      cellClass: 'fullName', // references excel style
      valueGetter: function (params) {
        return `${params.data.firstName} ${params.data.lastName}`
      },
    },
    { field: 'age' },
    { field: 'company' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
  },
  defaultExcelExportParams: {
    processCellCallback: params => {
      const rowIndex = params.accumulatedRowIndex
      const valueGetter = params.column.getColDef().valueGetter
      return !!valueGetter
        ? `=CONCATENATE(A${rowIndex}, " ", B${rowIndex})`
        : params.value
    },
  },
  excelStyles: [
    {
      id: 'fullName',
      dataType: 'Formula',
    },
  ],
  rowData: [
    { firstName: 'Mair', lastName: 'Inworth', age: 23, company: 'Rhyzio' },
    { firstName: 'Clair', lastName: 'Cockland', age: 38, company: 'Vitz' },
    { firstName: 'Sonni', lastName: 'Jellings', age: 24, company: 'Kimia' },
    { firstName: 'Kit', lastName: 'Clarage', age: 27, company: 'Skynoodle' },
    { firstName: 'Tod', lastName: 'de Mendoza', age: 29, company: 'Teklist' },
    { firstName: 'Herold', lastName: 'Pelman', age: 23, company: 'Divavu' },
    { firstName: 'Paula', lastName: 'Gleave', age: 37, company: 'Demimbu' },
    {
      firstName: 'Kendrick',
      lastName: 'Clayill',
      age: 26,
      company: 'Brainlounge',
    },
    {
      firstName: 'Korrie',
      lastName: 'Blowing',
      age: 32,
      company: 'Twitternation',
    },
    { firstName: 'Ferrell', lastName: 'Towhey', age: 40, company: 'Nlounge' },
    { firstName: 'Anders', lastName: 'Negri', age: 30, company: 'Flipstorm' },
    { firstName: 'Douglas', lastName: 'Dalmon', age: 25, company: 'Feedbug' },
    { firstName: 'Roxanna', lastName: 'Schukraft', age: 26, company: 'Skinte' },
    { firstName: 'Seumas', lastName: 'Pouck', age: 34, company: 'Aimbu' },
    { firstName: 'Launce', lastName: 'Welldrake', age: 25, company: 'Twinte' },
    { firstName: 'Siegfried', lastName: 'Grady', age: 34, company: 'Vimbo' },
    { firstName: 'Vinson', lastName: 'Hyams', age: 20, company: 'Tanoodle' },
    { firstName: 'Cayla', lastName: 'Duckerin', age: 21, company: 'Livepath' },
    { firstName: 'Luigi', lastName: 'Rive', age: 25, company: 'Quatz' },
    { firstName: 'Carolyn', lastName: 'Blouet', age: 29, company: 'Eamia' },
  ],
}

function onBtExport() {
  gridOptions.api!.exportDataAsExcel()
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)
})
