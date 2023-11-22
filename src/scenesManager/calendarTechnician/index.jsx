import React, { useState } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {  createEventId } from "./event-utils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import listPlugin from "@fullcalendar/list";
import { getShiftOfDate } from "../../redux/scheduleSlice";
import { useCallback } from "react";
import { debounce } from 'lodash';


const CalendarTechnician = () => {
  const dispatch = useDispatch();
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentEventsDay, setCurrentEventsDay] = useState([]);
  const [currentEventsWeek, setCurrentEventsWeek] = useState([]);
 const  [eventType, setEventType] = useState("");
 const  [eventTypeid, setEventTypeId] = useState("");
 const  [eventTypeDate, setEventTypeDate] = useState("");
 const [initialEvents, setInitialEvents] = useState([]);
 const  [id, setId] = useState("");
  const theme = createTheme();
  const colors = tokens(theme.palette.mode);

  const RESOURCES = [
    { id: "a", title: "Auditorium A" },
    { id: "b", title: "Auditorium B", eventColor: "green" },
    { id: "c", title: "Auditorium C", eventColor: "orange" },
  ];
  
  const INITIAL_EVENTS = [
    {
      id: eventTypeid,
      title: eventType,
      start: eventTypeDate ,
    
    },
  
  ]
  const fetchShiftDataForWeek = (startDate) => {
    const days = getWeekDays(startDate);
    // Gọi API cho từng ngày trong tuần
    days.forEach(day => {
      dispatch(getShiftOfDate({ date: day }));
    });
  };
  useEffect(() => {
    const handleFetchData = async () => {
      const days = getWeekDays(new Date());
      try {
        const promises = days.map(day => 
          dispatch(getShiftOfDate({ date: day })).unwrap()
        );
        const responses = await Promise.all(promises);
        if (responses && responses[0] && responses[0].data && responses[0].data.length > 0) {
          setInitialEvents([
            {
              id: responses[0].data[0].id,
              title: responses[0].data[0].type,
              start: responses[0].data[0].date,
              resourceId: 'a',
            }
          ]);
        }
        console.log("Updated INITIAL_EVENTS:", responses[0].data[0].type);
        // Kiểm tra và xử lý dữ liệu trả về từ API
       
      } catch (error) {
        console.error("Error fetching data for the week:", error);
      }
    };
  
    handleFetchData();
  }, [dispatch]);

  // Ví dụ: trong một hàm useEffect hoặc sự kiện xử lý
// useEffect(() => {
//   const mondayStr = getMondayStr(new Date()); // Lấy ngày thứ Hai của tuần hiện tại
//   dispatch(getShiftOfDate({ date: mondayStr }))
//     .then(response => {
//       // Xử lý phản hồi từ API
//       console.log(`Data for Monday ${mondayStr}:`, response);
//     })
//     .catch(error => {
//       // Xử lý lỗi
//       console.error(`Error fetching data for Monday ${mondayStr}:`, error);
//     });
// }, [dispatch]);


function getMondayOfWeek(date) {
  const day = date.getDay() || 7; // Chuyển đổi Chủ nhật từ 0 thành 7
  if (day !== 1) {
    date.setDate(date.getDate() - (day - 1)); // Thiết lập ngày về thứ Hai
  }
  return new Date(date); // Trả về ngày thứ Hai
}
function getMondayStr(startDateStr) {
  const startDate = new Date(startDateStr);
  const monday = getMondayOfWeek(startDate);
  return monday.toISOString().split('T')[0]; // Trả về chuỗi ngày thứ Hai định dạng YYYY-MM-DD
}
  const debouncedFetchShiftData = useCallback(debounce(fetchShiftDataForWeek, 1000), []);

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      dispatch(getShiftOfDate({ date: selectInfo.startStr  }));
    }
  };
    // Hàm xử lý khi chọn ngày trên lịch
    const handleDatesSet = (info) => {
      debouncedFetchShiftData(info.startStr);
    };
  
  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };
  function getWeekDays(startDateStr) {
    let days = [];
    const startDate = new Date(startDateStr);
    const monday = getMondayOfWeek(startDate);
  
    for (let i = 1; i <= 7; i++) { // Lặp từ thứ Hai đến Chủ nhật
      let nextDay = new Date(monday);
      nextDay.setDate(new Date(monday).getDate() + i);
      days.push(nextDay.toISOString().split('T')[0]);
    }
  
    return days; // Trả về mảng các ngày trong tuần
  }

  
  

  const renderSidebarEvent = (event) => {
    return (
      <li key={event.id}>
        <b>
          {formatDate(event.start, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </b>
        <i>{event.title}</i>
      </li>
    );
  };

  const renderSidebar = () => {
    return (
      <Box
        sx={{
          flex: "1 1 20%",
          backgroundColor: colors.primary[400],
          p: "15px",
          borderRadius: "4px",
          ml: "15px",
        }}
      >
        <Typography variant="h5">
          All Events ({currentEvents.length})
        </Typography>
        <List>
          <ListItem
            sx={{
              backgroundColor: colors.greenAccent[500],
              margin: "30px 0",
              borderRadius: "10px",
            }}
          >
            {currentEvents.map(renderSidebarEvent)}
          </ListItem>
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      {renderSidebar()}
      <Box sx={{ flex: "1 1 75%", ml: "30px" }}>
        <FullCalendar
        
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
        initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={initialEvents}
          resources={RESOURCES}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventsSet={handleEvents}
          locale="vi" // Thiết lập ngôn ngữ hiển thị là Tiếng Việt
          timeZone="Asia/Ho_Chi_Minh" // Thiết lập múi giờ là múi giờ Việt Nam
          datesSet={handleDatesSet}
          firstDay={1}
        />
      </Box>
    </Box>
  );
};

export default CalendarTechnician;