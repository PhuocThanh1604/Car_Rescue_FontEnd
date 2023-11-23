import React, { useState } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import listPlugin from "@fullcalendar/list";
import { getShiftOfDate } from "../../redux/scheduleSlice";
import { getTechnicianId } from "../../redux/technicianSlice";

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
  const [initialEvents, setInitialEvents] = useState([]);
  const [timedEventTitle, setTimedEventTitle] = useState("");
  const [fullnameData, setFullnameData] = useState({});
  const [id, setId] = useState("");
  const theme = createTheme();
  const colors = tokens(theme.palette.mode);
  const [technicianId, setTechnicianId] = useState("");
  const [technicianData, setTechnicianData] = useState({});

  const RESOURCES = [
    { id: "a", title: "Auditorium A" },
    { id: "b", title: "Auditorium B", eventColor: "green" },
    { id: "c", title: "Auditorium C", eventColor: "orange" },
  ];
  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }
  // const fetchShiftDataForWeek = async (startDateStr) => {
  //   const days = getWeekDays(startDateStr);
  //   const promises = days.map((day) =>
  //     dispatch(getShiftOfDate({ date: day })).unwrap()
  //   );
  //   try {
  //     const responses = await Promise.all(promises);
  //     console.log(responses);
  //     const updatedEvents = [];

  //     responses.forEach((response) => {
  //       if (response && response.data && response.data.length > 0) {
  //         const eventData = response.data[0];

  //         const eventId = createEventId();
  //         console.log(eventData.type);
  //         console.log(eventData.date);
  //         // Tạo sự kiện từ dữ liệu nhận được từ API

  //         let startHour = "00:00:00";
  //         let endHour = "08:00:00";

  //         if (eventData.type === "Midnight") {
  //           startHour = "00:00:00";
  //           endHour = "08:00:00";
  //         } else if (eventData.type === "Night") {
  //           startHour = "16:00:00";
  //           endHour = "24:00:00"; // Kết thúc vào ngày tiếp theo
  //         } else if (eventData.type === "Morning") {
  //           startHour = "08:00:00";
  //           endHour = "16:00:00";
  //         } else {
  //           // Xử lý các trường hợp khác của eventData.type ở đây (nếu cần)
  //         }

  //         const event = {
  //           id: eventId,
  //           title: eventData.type,
  //           description: eventData.technicianId,
  //           start: eventData.date.substring(0, 10) + "T" + startHour,
  //           end: eventData.date.substring(0, 10) + "T" + endHour,
  //           // Các trường thông tin khác từ API có thể được thêm vào đây
  //         };
  //         // Lưu giá trị technicianId vào state khi có dữ liệu eventData.technicianId
  //         if (eventData.technicianId) {
  //           const technicianId = eventData.technicianId;
  //           setTechnicianId(technicianId);

  //           // Gọi hàm fetchFullNameTechnician để lấy fullname từ API
  //           fetchFullNameTechnician(technicianId);
  //         }
  //         updatedEvents.push(event);
  //       }
  //     });

  //     setInitialEvents(updatedEvents);
  //   } catch (error) {
  //     console.error("Error fetching data for the week:", error);
  //   }
  // };

  const fetchShiftDataForWeek = async (startDateStr) => {
    const days = getWeekDays(startDateStr);
    const promises = days.map((day) => 
      dispatch(getShiftOfDate({ date: day })).unwrap()
    );
  
    try {
      const responses = await Promise.all(promises);
      const eventPromises = responses.map(async (response) => {
        if (response && response.data && response.data.length > 0) {
          const eventData = response.data[0];
          const fullname = await fetchFullNameTechnician(eventData.technicianId);
          console.log(fullname);
          
          // Tạo sự kiện từ dữ liệu nhận được từ API
        
          let startHour = "00:00:00";
          let endHour = "08:00:00";

          if (eventData.type === "Midnight") {
            startHour = "00:00:00";
            endHour = "08:00:00";
          } else if (eventData.type === "Night") {
            startHour = "16:00:00";
            endHour = "24:00:00"; // Kết thúc vào ngày tiếp theo
          } else if (eventData.type === "Morning") {
            startHour = "08:00:00";
            endHour = "16:00:00";
          } else {
            // Xử lý các trường hợp khác của eventData.type ở đây (nếu cần)
          }
  
          return {
            id: createEventId(),
            title: eventData.type,
            description:fullname, // Đặt fullname vào trường description
            start: eventData.date.substring(0, 10) + "T" + startHour,
            end: eventData.date.substring(0, 10) + "T" + endHour,
          };
        }
        return null;
      });
  
      const updatedEvents = (await Promise.all(eventPromises)).filter(event => event);
      setInitialEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching data for the week:", error);
    }
  };
  const fetchFullNameTechnician = async (technicianId) => {
    try {
      const response = await dispatch(getTechnicianId({ id: technicianId })).unwrap();
      console.log("Response data:", response.data); // Log to check the structure of response data
  
      // Check the structure of response data to find the correct field containing fullname
      const fullname = response.data?.fullname || response.data?.name ;
      return fullname;
    } catch (error) {
      console.error("Error fetching fullname:", error);
      return null;
    }
  };
  
  
// useEffect để theo dõi thay đổi của technicianData và cập nhật description của event
useEffect(() => {
  // Nếu có technicianData và fullname được trả về từ API
  if (technicianData && technicianData.fullname) {
    console.log(technicianData.fullname)
    // Cập nhật description của event với fullname từ technicianData
    setInitialEvents((prevEvents) => {
      return prevEvents.map((event) => {
        if (event.description === technicianData.technicianId) {
          return {
            ...event,
            description: technicianData.fullname,
          };
        }
        return event;
      });
    });
  }
}, [technicianData]);

  useEffect(() => {
    const getShiftData = async () => {
      try {
        const days = getWeekDays(new Date());
        const promises = days.map((day) =>
          dispatch(getShiftOfDate({ date: day })).unwrap()
        );
        const responses = await Promise.all(promises);
        console.log(responses);
        const updatedEvents = [];

        responses.forEach((response) => {
          if (response && response.data && response.data.length > 0) {
            const eventData = response.data[0];

            const eventId = createEventId();
            console.log(eventData.type);
            console.log(eventData.date);
            // Tạo sự kiện từ dữ liệu nhận được từ API

            let startHour = "00:00:00";
            let endHour = "08:00:00";

            if (eventData.type === "Midnight") {
              startHour = "00:00:00";
              endHour = "08:00:00";
            } else if (eventData.type === "Night") {
              startHour = "16:00:00";
              endHour = "24:00:00"; // Kết thúc vào ngày tiếp theo
            } else if (eventData.type === "Morning") {
              startHour = "08:00:00";
              endHour = "16:00:00";
            } else {
              // Xử lý các trường hợp khác của eventData.type ở đây (nếu cần)
            }

            const event = {
              id: eventId,
              title: eventData.type,
              start: eventData.date.substring(0, 10) + "T" + startHour,
              end: eventData.date.substring(0, 10) + "T" + endHour,
              // Các trường thông tin khác từ API có thể được thêm vào đây
            };

            updatedEvents.push(event);
          }
        });

        setInitialEvents(updatedEvents); // Cập nhật mảng sự kiện ban đầu với sự kiện mới từ API
      } catch (error) {
        console.error("Error fetching data for the week:", error);
      }
    };

    getShiftData();
  }, [dispatch]);

  function getMondayOfWeek(date) {
    const day = date.getDay() || 7; // Chuyển đổi Chủ nhật từ 0 thành 7
    if (day !== 0) {
      date.setDate(date.getDate() - (day - 0)); // Thiết lập ngày về thứ Hai
    }
    return new Date(date); // Trả về ngày thứ Hai
  }

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
    fetchShiftDataForWeek(info.startStr);
  };
  const handleEvents = (events) => {
    setCurrentEvents(events);
  };
  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        <p>{eventInfo.event.extendedProps.description}</p>
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
            right: "timeGridWeek,timeGridDay,listMonth",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={initialEvents}
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
