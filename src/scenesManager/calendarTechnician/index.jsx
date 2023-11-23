import React, { useState } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import listPlugin from "@fullcalendar/list";
import { getShiftOfDate } from "../../redux/scheduleSlice";
import { useCallback } from "react";
import { debounce } from "lodash";

const CalendarTechnician = () => {
  const dispatch = useDispatch();
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentEventsDay, setCurrentEventsDay] = useState([]);
  const [currentEventsWeek, setCurrentEventsWeek] = useState([]);
  const [shiftEvents, setShiftEvents] = useState([]);
  const [eventType, setEventType] = useState("");
  const [eventTypeid, setEventTypeId] = useState("");
  const [eventTypeDate, setEventTypeDate] = useState("");
  const [initialEvents, setInitialEvents] = useState("");
  const [timedEventTitle, setTimedEventTitle] = useState("");
  const [fullnameData, setFullnameData] = useState({});
  const [id, setId] = useState("");
  const theme = createTheme();
  const colors = tokens(theme.palette.mode);

  const RESOURCES = [
    { id: "a", title: "Auditorium A" },
    { id: "b", title: "Auditorium B", eventColor: "green" },
    { id: "c", title: "Auditorium C", eventColor: "orange" },
  ];
  let todayStr = new Date().toISOString().replace(/T.*$/, "");
  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }
  const INITIAL = [
    {
      // id: createEventId(),
      title: "All-day event",
      date: todayStr,
      // resourceId: "a",
    },
    {
      // id: createEventId(),
      title: "test 222" + timedEventTitle,
      date: todayStr + "T12:00:00",
      // resourceId: "b",
    },
    {
      // id: createEventId(),
      title: "Timed event 2" + timedEventTitle,
      date: todayStr + "T13:00:00",
      // resourceId: "c",
    },
    {
      // id: createEventId(),
      title: "Timed event 4"+timedEventTitle,
      date: todayStr + "T19:00:00",
      // resourceId: "d",
    },
  ];

  // setInitialEvents(INITIAL);
  console.log(INITIAL);

  const fetchShiftDataForWeek = (startDate) => {
    const days = getWeekDays(startDate);
    // Gọi API cho từng ngày trong tuần
    days.forEach((day) => {
      dispatch(getShiftOfDate({ date: day }));
    });
  };

  useEffect(() => {
    console.log("DEBUG01");
    const handleFetchData = async () => {
      const days = getWeekDays(new Date());
      try {
        const promises = days.map((day) =>
          dispatch(getShiftOfDate({ date: day })).unwrap()
        );
        const responses = await Promise.all(promises);
        console.log(responses);
        if (
          responses
          // responses &&
          // responses[0] &&
          // responses[0].data &&
          // responses[0].data.length > 0
        ) {
          const title = responses[2].data[0].type.toString();
          console.log(title);
          setInitialEvents(responses[2].data[2]);
          setTimedEventTitle(() => title);
          // console.log(title);
        }

        console.log("Updated INITIAL_EVENTS:", responses[2].data[0].type);
        // Kiểm tra và xử lý dữ liệu trả về từ API
      } catch (error) {
        console.error("Error fetching data for the week:", error);
      }
    };

    handleFetchData();
  }, [dispatch]);

  const fecthShiftOfDate = (customerId) => {
    if (!fullnameData[customerId]) {
      dispatch(getShiftOfDate({ id: customerId }))
        .then((response) => {
          const data = response.payload.data;
          if (data && data.fullname) {
            // Update the state with the fetched fullname
            setFullnameData((prevData) => ({
              ...prevData,
              [customerId]: data.fullname,
            }));
          } else {
            console.error("Fullname not found in the API response.");
          }
        })
        .catch((error) => {
          console.error("Error while fetching customer data:", error);
        });
    }
    // You can use your existing code to fetch the fullname
  };
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
    return monday.toISOString().split("T")[0]; // Trả về chuỗi ngày thứ Hai định dạng YYYY-MM-DD
  }
  const debouncedFetchShiftData = useCallback(
    debounce(fetchShiftDataForWeek, 1000),
    []
  );

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
      dispatch(getShiftOfDate({ date: selectInfo.startStr }));
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

    for (let i = 1; i <= 7; i++) {
      // Lặp từ thứ Hai đến Chủ nhật
      let nextDay = new Date(monday);
      nextDay.setDate(new Date(monday).getDate() + i);
      days.push(nextDay.toISOString().split("T")[0]);
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
        {console.log("DEBUG02" + INITIAL)}
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
          events={INITIAL}
          // resources={RESOURCES}
          select={handleDateSelect}
          eventContent={renderEventContent}
          // eventsSet={handleEvents}
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
