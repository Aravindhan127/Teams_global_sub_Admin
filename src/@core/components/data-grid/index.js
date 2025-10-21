import React, { useState, useEffect } from 'react'

// ** MUI Imports
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import { Box, CircularProgress, Typography } from '@mui/material'
import { DefaultPaginationSettings } from 'src/constants/general.const'

const CustomLoadingOverlay = () => {
    return (
        <Box sx={{ height: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    )
}

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '500px',
    height: '100%'
}))

const CustomNoRowsOverlay = () => {
    return (
        <StyledGridOverlay>
            <Typography variant='body2' sx={{ fontSize: '1rem', fontWeight: 600, mt: 4, alignItems: 'center' }}>
                No Result Found
            </Typography>
            <Typography variant='body2' sx={{ textDecoration: 'none', fontSize: '0.875rem', mt: 4, alignItems: 'center' }}>
                We couldn't found what you're looking for
            </Typography>
        </StyledGridOverlay>
    )
}

const CustomDataGrid = ({
    ID,
    loading,
    handleCellClick,
    excelRowNumber,
    rowCount,
    rows,
    columns,
    fetchPageData,
    overrideConfigs,
    currentPage,
    pageSize: propsPageSize,
    sortModel: propsSortModel,
    setCurrentPage,
    setPageSize: propsSetPageSize,
    setSortModel: propsSetSortModel,
    setSelectionModel: propsSetSelectionModel,
    selectionModel: propsSelectionModel,
    onSelectionModelChange,
    checkboxSelection,
    filterModel,
    hideToolBarEvent = false,
    nofilter = false,
    ...restProps
}) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }])
    const [selectionModel, setSelectionModel] = useState([])

    useEffect(() => {
        if (fetchPageData) {
            fetchPageData({
                page: page,
                pageSize: pageSize
            })
        }
    }, [page, pageSize, fetchPageData])

    const CustomToolbar = () => (
        <GridToolbarContainer sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", gap: 3 }}>
            <GridToolbarQuickFilter debounceMs={500} />
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );

    return (
        <DataGrid
            pagination
            autoHeight
            paginationMode='server'
            loading={loading}
            rowCount={rowCount}
            rows={rows}
            columns={columns.map(col => ({
                ...col,
                disableColumnMenu: nofilter || col.disableColumnMenu,
                headerClassName: 'sort-header',
            }))}
            pageSizeOptions={DefaultPaginationSettings.ROWS_PER_PAGE_OPTIONS}
            onPageSizeChange={newPageSize => (propsSetPageSize ? propsSetPageSize(newPageSize) : setPageSize(newPageSize))}
            sortModel={propsSortModel ? propsSortModel : sortModel}
            onSortModelChange={newSortModel =>
                propsSortModel ? propsSetSortModel(newSortModel) : setSortModel(newSortModel)
            }
            paginationModel={{
                page: (setCurrentPage ? currentPage : page) - 1,
                pageSize: propsPageSize ? propsPageSize : pageSize
            }}
            onPaginationModelChange={newPaginationModel => {
                if (newPaginationModel.page !== (setCurrentPage ? currentPage : page) - 1) {
                    setCurrentPage ? setCurrentPage(newPaginationModel.page + 1) : setPage(newPaginationModel.page + 1)
                }
                if (newPaginationModel.pageSize !== (propsPageSize ? propsPageSize : pageSize)) {
                    propsSetPageSize ? propsSetPageSize(newPaginationModel.pageSize) : setPageSize(newPaginationModel.pageSize)
                }
            }}
            disableColumnSelector
            disableDensitySelector
            disableSelectionOnClick
            getRowId={ID}
            {...overrideConfigs}
            slots={{
                toolbar: hideToolBarEvent ? undefined : CustomToolbar,
                loadingOverlay: CustomLoadingOverlay,
                noRowsOverlay: CustomNoRowsOverlay,
            }}
                      sx={{
  '--DataGrid-overlayHeight': '500px',

  // 🔹 Make sure all icons (sort, filter, 3-dot menu) are visible and white
  '.MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
    color: '#ffffff',
  },
  '.MuiDataGrid-menuIconButton': {
    color: '#ffffff',
  },

  // 🔹 On hover — keep them white too
  '.MuiDataGrid-iconButtonContainer:hover, .MuiDataGrid-menuIconButton:hover': {
    color: '#ffffff',
  },

  // 🔹 Sort icon — already white
  '.MuiDataGrid-sortIcon': {
    opacity: 'inherit !important',
    color: '#ffffff',
  },

  // Optional — keep header text readable if background is dark
  '.MuiDataGrid-columnHeaderTitle': {
    color: '#ffffff',
    fontWeight: 600,
  },
}}
            onCellClick={({ field, row }) => handleCellClick && handleCellClick({ field, row })}
            getCellClassName={params => {
                if (handleCellClick && !['Actions'].includes(params.field)) return 'cursor-pointer'
                return ''
            }}
            selectionModel={propsSelectionModel ? propsSelectionModel : selectionModel}
            onSelectionModelChange={newSelection => {
                propsSelectionModel ? propsSetSelectionModel(newSelection) : setSelectionModel(newSelection)
                if (onSelectionModelChange) onSelectionModelChange(newSelection)
            }}
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick
        />
    )
}

export default CustomDataGrid
