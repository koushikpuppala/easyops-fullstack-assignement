import React, { useEffect, useState } from 'react'
import './App.css'
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Pagination,
	PaginationItem,
	Stack,
	Typography,
} from '@mui/material'
import {
	DataGrid,
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid'
import { DeleteOutlineTwoTone, SearchTwoTone } from '@mui/icons-material'
import styled from '@emotion/styled'

function App() {
	const [values, setValues] = useState({
		firstName: '',
		lastName: '',
		contactNumber: '',
		searchName: '',
		errorName: '',
		errorContactNumber: '',
	})
	const [data, setData] = useState([])

	const columns = [
		{
			field: 'id',
			headerName: 'SI.No',
			width: 100,
			sortable: false,
		},
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'contactNumber', headerName: 'Contact Number', width: 200, sortable: false },
		{
			field: 'action',
			headerName: 'Action',
			width: 100,
			renderCell: (params) => {
				return (
					<>
						<IconButton
							onClick={() => handleDelete(params.row.id)}
							color='error'
							aria-label='delete'>
							<DeleteOutlineTwoTone />
						</IconButton>
					</>
				)
			},
			sortable: false,
		},
	]

	const handleSubmit = () => {
		const name = `${values.firstName} ${values.lastName}`

		data.forEach((item) => {
			if (item.name === name) {
				setValues({
					...values,
					errorName: 'Name already exist',
				})
			}
		})

		setData([
			...data,
			{
				id: data.length + 1,
				name: `${values.firstName} ${values.lastName}`,
				contactNumber: values.contactNumber,
			},
		])
		setValues({
			...values,
			firstName: '',
			lastName: '',
			contactNumber: '',
		})

		localStorage.setItem(
			'data',
			JSON.stringify([
				...data,
				{
					id: data.length + 1,
					name: `${values.firstName} ${values.lastName}`,
					contactNumber: values.contactNumber,
				},
			])
		)
	}

	const handleChange = (e) => {
		const { id, value } = e.target

		switch (id) {
			case 'first-name':
				setValues({
					...values,
					firstName: value,
					errorName: data.map((item) => item.name).includes(`${value} ${values.lastName}`)
						? 'Name already exist'
						: '',
				})
				break
			case 'last-name':
				setValues({
					...values,
					lastName: value,
					errorName: data
						.map((item) => item.name)
						.includes(`${values.firstName} ${value}`)
						? 'Name already exist'
						: '',
				})
				break
			case 'contact-number':
				!isNaN(Number(value)) &&
					setValues({
						...values,
						contactNumber: value,
						errorContactNumber: data.map((item) => item.contactNumber).includes(value)
							? 'Contact Number already exist'
							: '',
					})
				break
			case 'search-name':
				setValues({
					...values,
					searchName: value,
				})
				if (value === '') {
					setData(JSON.parse(localStorage.getItem('data')))
				} else {
					setData(
						data.filter((item) => {
							return item.name.toLowerCase().includes(value.toLowerCase())
						})
					)
				}
				break
			default:
				break
		}
	}

	const handleDelete = (id) => {
		const confirm = window.confirm('Are you sure you want to delete?')
		if (confirm) {
			setData(
				data
					.filter((item) => item.id !== id)
					.map((item, index) => ({ ...item, id: index + 1 }))
			)
			localStorage.setItem(
				'data',
				JSON.stringify(
					data
						.filter((item) => item.id !== id)
						.map((item, index) => ({
							...item,
							id: index + 1,
						}))
				)
			)
		} else {
			return
		}
	}

	useEffect(() => {
		if (localStorage.getItem('data')) {
			setData(JSON.parse(localStorage.getItem('data')))
		} else {
			setData([])
		}
	}, [])

	const CustomPagination = () => {
		const apiRef = useGridApiContext()
		const page = useGridSelector(apiRef, gridPageSelector)
		const pageCount = useGridSelector(apiRef, gridPageCountSelector)

		return (
			<Pagination
				color='primary'
				variant='outlined'
				shape='rounded'
				page={page + 1}
				count={pageCount}
				renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
				onChange={(event, value) => apiRef.current.setPage(value - 1)}
			/>
		)
	}

	const StyledGridOverlay = styled('div')(() => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		padding: '10px',
		'& .ant-empty-img-1': {
			fill: '#aeb8c2',
		},
		'& .ant-empty-img-2': {
			fill: '#f5f5f7',
		},
		'& .ant-empty-img-3': {
			fill: '#dce0e6',
		},
		'& .ant-empty-img-4': {
			fill: '#fff',
		},
		'& .ant-empty-img-5': {
			fillOpacity: '0.8',
			fill: '#f5f5f5',
		},
	}))

	const CustomNoRowsOverlay = () => {
		return (
			<StyledGridOverlay>
				<svg width='120' height='100' viewBox='0 0 184 152' aria-hidden focusable='false'>
					<g fill='none' fillRule='evenodd'>
						<g transform='translate(24 31.67)'>
							<ellipse
								className='ant-empty-img-5'
								cx='67.797'
								cy='106.89'
								rx='67.797'
								ry='12.668'
							/>
							<path
								className='ant-empty-img-1'
								d='M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z'
							/>
							<path
								className='ant-empty-img-2'
								d='M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z'
							/>
							<path
								className='ant-empty-img-3'
								d='M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z'
							/>
						</g>
						<path
							className='ant-empty-img-3'
							d='M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z'
						/>
						<g className='ant-empty-img-4' transform='translate(149.65 15.383)'>
							<ellipse cx='20.654' cy='3.167' rx='2.849' ry='2.815' />
							<path d='M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z' />
						</g>
					</g>
				</svg>
				<Box sx={{ m: 1 }}>
					<Typography variant='h6' gutterBottom component='div'>
						No Data Available. Fill and Submit the above form.
					</Typography>
				</Box>
			</StyledGridOverlay>
		)
	}

	return (
		<Box className='header'>
			<Box sx={{ padding: '10px', width: '75%' }}>
				<Grid container spacing={2}>
					<Grid item sx={{ display: 'flex', justifyContent: 'space-evenly' }} xs={12}>
						<Stack spacing={1} sx={{ width: '50%', paddingRight: '20px' }}>
							<FormControl variant='outlined'>
								<InputLabel htmlFor='first-name'>First Name</InputLabel>
								<OutlinedInput
									id='first-name'
									value={values.firstName}
									fullWidth
									error={values.errorName !== '' ? true : false}
									placeholder='First Name'
									label='First Name'
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
							<FormHelperText error id='first-name-helper-text'>
								{values.errorName}
							</FormHelperText>
						</Stack>
						<Stack spacing={1} sx={{ width: '50%' }}>
							<FormControl variant='outlined'>
								<InputLabel htmlFor='last-name'>Last Name</InputLabel>
								<OutlinedInput
									id='last-name'
									value={values.lastName}
									fullWidth
									error={values.errorName !== '' ? true : false}
									placeholder='Last Name'
									label='Last Name'
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
							<FormHelperText error id='last-name-helper-text'>
								{values.errorName}
							</FormHelperText>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<FormControl variant='outlined'>
								<InputLabel htmlFor='contact-number'>Contact Number</InputLabel>
								<OutlinedInput
									id='contact-number'
									value={values.contactNumber}
									fullWidth
									error={values.errorContactNumber !== '' ? true : false}
									placeholder='Contact Number'
									label='Contact Number'
									onChange={(e) => handleChange(e)}
								/>
							</FormControl>
							<FormHelperText error id='contact-number-helper-text'>
								{values.errorContactNumber}
							</FormHelperText>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant='outlined'
							color='success'
							sx={{ width: '100%', height: '50px' }}
							onClick={handleSubmit}
							disabled={
								values.firstName === '' ||
								values.lastName === '' ||
								values.contactNumber === '' ||
								values.errorContactNumber !== ''
									? true
									: false
							}>
							Save
						</Button>
					</Grid>

					{data.length > 0 ? (
						<>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<FormControl variant='outlined'>
										<InputLabel htmlFor='search-name'>Search Name</InputLabel>
										<OutlinedInput
											id='search-name'
											value={values.searchName}
											fullWidth
											placeholder='Search Name'
											label='Search Name'
											onChange={(e) => handleChange(e)}
											endAdornment={
												<InputAdornment position='end'>
													<IconButton
														aria-label='search icon'
														edge='end'
														size='small'>
														<SearchTwoTone />
													</IconButton>
												</InputAdornment>
											}
										/>
									</FormControl>
								</Stack>
							</Grid>

							<Grid item xs={12}>
								<DataGrid
									sx={{
										'& .MuiDataGrid-cell': {
											fontFamily: 'Montserrat, sans-serif',
										},
										'& .MuiDataGrid-columnHeaderTitle': {
											textOverflow: 'clip',
											whiteSpace: 'break-spaces',
											height: 'auto',
											lineHeight: 1,
											fontFamily: 'Montserrat, sans-serif',
											fontWeight: '700',
										},
									}}
									disableColumnMenu={true}
									disableSelectionOnClick={true}
									rows={data}
									columns={columns}
									autoHeight={true}
									pageSize={10}
									isRowSelectable={() => {
										return false
									}}
									components={{
										Pagination: CustomPagination,
										NoRowsOverlay: CustomNoRowsOverlay,
									}}
									getRowId={(row) => row.contactNumber}
								/>
							</Grid>
						</>
					) : (
						<Grid item xs={12}>
							<CustomNoRowsOverlay />
						</Grid>
					)}
				</Grid>
			</Box>
		</Box>
	)
}

export default App
