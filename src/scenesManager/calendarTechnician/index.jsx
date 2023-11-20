import React, { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleOfTechinciansAWeek } from "../../redux/technicianSlice";

const CalendarTechnician = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const technicians = useSelector((state) => state.technician.technicians);
  const [currentEvents, setCurrentEvents] = useState([]); // Initialize with an empty array
  const convertToDateString = (date) => {
    return formatDate(date, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
    }
  };

  useEffect(() => {
    // Gửi yêu cầu API để lấy dữ liệu lịch
    const fetchDataFromServer = async () => {
      try {
        const response = await dispatch(
          getScheduleOfTechinciansAWeek({ year: 2023 })
        );
        const data = response.payload.data; // Log the data
        console.log("test" + data);

        if (Array.isArray(data) && data.length > 0) {
          // Process and map the data
          const events = data.map((event) => ({
            id: event.id,
            week: event.week,
            year: event.year,
            startDate: event.startDate,
            endDate: event.endDate,
          }));

          // Log data from each event
          events.forEach((event) => {
            console.log("Event ID:", event.id);
            console.log("Week:", event.week);
            console.log("Year:", event.year);
            console.log("Start Date:", event.startDate);
            console.log("End Date:", event.endDate);
          });

          setCurrentEvents(events);
        } else {
          console.error("Data from the API is not an array or is empty.");
        }
      } catch (error) {
        console.error("Error when fetching calendar data:", error);
      }
    };

    fetchDataFromServer();
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header
        title="Lịch Kỹ Thuật Viên"
        subtitle="Trang tương tác toàn bộ lịch"
      />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "30px 0",
                  borderRadius: "10px",
                }}
              >
                <ListItemText
                  primary={event.startDate}
                  secondary={
                    <Typography>
                      {formatDate(event.startDate, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
                <ListItemText
                  primary={event.endDate}
                  secondary={
                    <Typography>
                      {formatDate(event.endDate, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
                {/* <Typography variant="body2">ID: {event.id}</Typography> */}
                {/* <Typography variant="body2">Week: {event.week}</Typography> */}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="30px">
          <FullCalendar
            height="75vh"
            plugins={[ timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventSources={[currentEvents]}
            eventColor={colors.greenAccent[500]}
            eventTextColor="white"
            weekends={true}
            dayHeaders={true}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarTechnician;
