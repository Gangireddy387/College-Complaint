import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Collapse,
  Fade,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export const ResponsiveTable = ({
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  expandable = false,
  expandableContent,
  loading = false,
  emptyMessage = "No data available",
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // >= 1200px

  const [expandedRows, setExpandedRows] = React.useState({});

  const handleExpandRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAction = (action, row, event) => {
    event.stopPropagation();
    if (action === 'view' && onView) onView(row);
    if (action === 'edit' && onEdit) onEdit(row);
    if (action === 'delete' && onDelete) onDelete(row);
  };

  // Mobile Grid View (< 900px)
  if (isMobile) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {data.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {emptyMessage}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={isSmallMobile ? 1 : 2}>
            {data.map((row, index) => (
              <Grid item xs={12} key={row.id || index}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': onRowClick ? {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      } : {},
                      borderRadius: 2,
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <CardContent sx={{ p: isSmallMobile ? 2 : 3 }}>
                      {/* Main Content */}
                      <Box sx={{ mb: 2 }}>
                        {columns.map((column) => {
                          if (column.hideOnMobile) return null;
                          
                          const value = column.render 
                            ? column.render(row[column.field], row)
                            : row[column.field];

                          return (
                            <Box
                              key={column.field}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1.5,
                                '&:last-child': { mb: 0 },
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ 
                                  fontWeight: 600, 
                                  minWidth: '35%',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {column.headerName}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'flex-end',
                                minWidth: '65%',
                                textAlign: 'right',
                              }}>
                                {typeof value === 'string' || typeof value === 'number' ? (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: column.bold ? 600 : 400,
                                      color: column.color || 'text.primary',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                ) : (
                                  value
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* Action Buttons */}
                      {(onEdit || onDelete || onView) && (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          justifyContent: 'flex-end',
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}>
                          {onView && (
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('view', row, e)}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'primary.dark' },
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onEdit && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('edit', row, e)}
                                sx={{
                                  bgcolor: 'warning.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'warning.dark' },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('delete', row, e)}
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'error.dark' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      )}

                      {/* Expandable Content */}
                      {expandable && expandableContent && (
                        <Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              py: 1,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(row.id || index);
                            }}
                          >
                            <Typography variant="caption" color="primary" sx={{ mr: 1 }}>
                              {expandedRows[row.id || index] ? 'Show Less' : 'Show More'}
                            </Typography>
                            {expandedRows[row.id || index] ? (
                              <ExpandLessIcon fontSize="small" color="primary" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" color="primary" />
                            )}
                          </Box>
                          <Collapse in={expandedRows[row.id || index]}>
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                              {expandableContent(row)}
                            </Box>
                          </Collapse>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Tablet Grid View (900px - 1200px)
  if (isTablet && !isMobile) {
    return (
      <Box sx={{ width: '100%', ...sx }}>
        {data.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {emptyMessage}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {data.map((row, index) => (
              <Grid item xs={12} sm={6} key={row.id || index}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': onRowClick ? {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      } : {},
                      borderRadius: 2,
                      height: '100%',
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Main Content */}
                      <Box sx={{ mb: 2 }}>
                        {columns.map((column) => {
                          if (column.hideOnTablet) return null;
                          
                          const value = column.render 
                            ? column.render(row[column.field], row)
                            : row[column.field];

                          return (
                            <Box
                              key={column.field}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1.5,
                                '&:last-child': { mb: 0 },
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ 
                                  fontWeight: 600, 
                                  minWidth: '40%',
                                }}
                              >
                                {column.headerName}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'flex-end',
                                minWidth: '60%',
                                textAlign: 'right',
                              }}>
                                {typeof value === 'string' || typeof value === 'number' ? (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: column.bold ? 600 : 400,
                                      color: column.color || 'text.primary',
                                    }}
                                  >
                                    {value}
                                  </Typography>
                                ) : (
                                  value
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* Action Buttons */}
                      {(onEdit || onDelete || onView) && (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          justifyContent: 'flex-end',
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}>
                          {onView && (
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('view', row, e)}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'primary.dark' },
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onEdit && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('edit', row, e)}
                                sx={{
                                  bgcolor: 'warning.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'warning.dark' },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {onDelete && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={(e) => handleAction('delete', row, e)}
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'error.dark' },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      )}

                      {/* Expandable Content */}
                      {expandable && expandableContent && (
                        <Box>
                          <Divider sx={{ my: 1.5 }} />
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              py: 1,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(row.id || index);
                            }}
                          >
                            <Typography variant="caption" color="primary" sx={{ mr: 1 }}>
                              {expandedRows[row.id || index] ? 'Show Less' : 'Show More'}
                            </Typography>
                            {expandedRows[row.id || index] ? (
                              <ExpandLessIcon fontSize="small" color="primary" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" color="primary" />
                            )}
                          </Box>
                          <Collapse in={expandedRows[row.id || index]}>
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                              {expandableContent(row)}
                            </Box>
                          </Collapse>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Desktop Table View
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        width: '100%',
        boxShadow: 1,
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.paper' }}>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  backgroundColor: 'background.paper',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  ...column.headerStyle,
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
            {(onView || onEdit || onDelete) && (
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  backgroundColor: 'background.paper',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                  width: 120,
                }}
              >
                Actions
              </TableCell>
            )}
            {expandable && (
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  backgroundColor: 'background.paper',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                  width: 80,
                }}
              >
                Details
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0) + (expandable ? 1 : 0)}
                sx={{ textAlign: 'center', py: 4 }}
              >
                <Typography variant="body1" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <React.Fragment key={row.id || index}>
                <TableRow
                  hover
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      sx={{
                        ...column.cellStyle,
                        fontWeight: column.bold ? 600 : 400,
                      }}
                    >
                      {column.render 
                        ? column.render(row[column.field], row)
                        : row[column.field]
                      }
                    </TableCell>
                  ))}
                  
                  {/* Actions */}
                  {(onView || onEdit || onDelete) && (
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {onView && (
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={(e) => handleAction('view', row, e)}
                              sx={{ color: 'primary.main' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={(e) => handleAction('edit', row, e)}
                              sx={{ color: 'warning.main' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) => handleAction('delete', row, e)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}

                  {/* Expandable Row */}
                  {expandable && (
                    <TableCell sx={{ textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpandRow(row.id || index);
                        }}
                        sx={{ color: 'primary.main' }}
                      >
                        {expandedRows[row.id || index] ? (
                          <ExpandLessIcon fontSize="small" />
                        ) : (
                          <ExpandMoreIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>

                {/* Expandable Content */}
                {expandable && expandableContent && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0) + 1}
                      sx={{ p: 0, border: 0 }}
                    >
                      <Collapse in={expandedRows[row.id || index]} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                          {expandableContent(row)}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
