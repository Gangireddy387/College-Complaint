import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
} from '@mui/material';

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary', 
  tooltip = '',
  subtitle = '',
  trend = null,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getColorValue = (colorName) => {
    return theme.palette[colorName]?.main || theme.palette.primary.main;
  };

  const cardContent = (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        ...sx,
      }}
    >
      <CardContent 
        sx={{ 
          p: isMobile ? 2 : 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Header with Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              borderRadius: 2,
              backgroundColor: `${getColorValue(color)}15`,
              color: getColorValue(color),
              mr: 2,
            }}
          >
            <Icon 
              sx={{ 
                fontSize: isMobile ? '1.25rem' : '1.5rem',
              }} 
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant={isMobile ? "caption" : "body2"}
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  opacity: 0.7,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Value */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              color: getColorValue(color),
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          
          {/* Trend Indicator */}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: trend > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                from last month
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      {cardContent}
    </Tooltip>
  ) : (
    <Fade in timeout={500}>
      {cardContent}
    </Fade>
  );
};
