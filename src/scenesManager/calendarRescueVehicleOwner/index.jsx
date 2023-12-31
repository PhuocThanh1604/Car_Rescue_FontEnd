import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
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
import { styled } from "@mui/system";
import Header from "../../components/Header";
import { getRescueVehicleOwnerId } from "../../redux/rescueVehicleOwnerSlice";

const StyledList = styled(List)({
  maxHeight: 700,
  overflowY: "auto",
});
const CalendarTechnician = () => {
  const dispatch = useDispatch();
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentEventsDay, setCurrentEventsDay] = useState([]);
  const [currentEventsWeek, setCurrentEventsWeek] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const theme = createTheme();
  const colors = tokens(theme.palette.mode);
  const [technicianData, setTechnicianData] = useState({});

  let eventGuid = 0;
  function createEventId() {
    return String(eventGuid++);
  }
  const getEventColor = (eventType) => {
    switch (eventType) {
      case "Midnight":
        return colors.blueAccent[600]; // Màu vàng cho sự kiện Midnight
      case "Night":
        return colors.teal[700]; // Màu xanh dương cho Night
      // Thêm các trường hợp khác ở đây
      default:
        return "defaultColor"; // Màu mặc định
    }
  };

  const fetchShiftDataForWeek = async (startDateStr) => {
    const days = getWeekDays(startDateStr);
    const promises = days.map((day) =>
      dispatch(getShiftOfDate({ date: day })).unwrap()
    );

    try {
      const responses = await Promise.all(promises);
      const eventPromises = responses.flatMap(response => {
        // Check if response data is available and has items
        if (response && response.data && response.data.length > 0) {
          // Filter items that have a technicianId and process them
          return response.data.filter(eventData => eventData.rvoid).map(async (eventData) => {
            const fullname = await fetchFullNameRescueCarOwner(eventData.rvoid);

            // Define shift hours based on shift type
            let startHour = "00:00:00";
            let endHour = "08:00:00";

            // Conditional statements to set startHour and endHour
            if (eventData.type === "Midnight") {
              startHour = "00:00:00";
              endHour = "08:00:00";
            } else if (eventData.type === "Night") {
              startHour = "16:00:00";
              endHour = "24:00:00";
            } else if (eventData.type === "Morning") {
              startHour = "08:00:00";
              endHour = "16:00:00";
            }

            // Calculate the event color
            const eventColor = getEventColor(eventData.type);

            // Return the event object
            return {
              id: createEventId(),
              title: eventData.type,
              description: fullname,
              start: eventData.date.substring(0, 10) + "T" + startHour,
              end: eventData.date.substring(0, 10) + "T" + endHour,
              color: eventColor,
            };
          });
        }
        return [];
      });

      const updatedEvents = (await Promise.all(eventPromises.flat())).filter(event => event);
      setInitialEvents(updatedEvents);
      setCurrentEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching data for the week:", error);
    }
  };
  // const fetchShiftDataForWeek = async (startDateStr) => {
  //   const days = getWeekDays(startDateStr);
  //   const promises = days.map((day) =>
  //     dispatch(getShiftOfDate({ date: day })).unwrap()
  //   );
  
  //   try {
  //     const responses = await Promise.all(promises);
  //     const eventPromises = responses.map(async (response) => {
  //       if (response && response.data && response.data.length > 0) {
  //         const eventData = response.data[0];
  //           console.log(eventData.rvoid)
  //         // Kiểm tra nếu eventData có chứa rvoid
  //         if (!eventData.rvoid) {
  //           return null; // Không tạo sự kiện nếu không có rvoid
  //         }
  
  //         const fullname = await fetchFullNameRescueCarOwner(eventData.rvoid);
  //         console.log(fullname);
  
  //         // Xử lý tạo sự kiện như trước nếu có rvoid
  //         let startHour = "00:00:00";
  //         let endHour = "08:00:00";
  //         // ... Các xử lý khác cho startHour và endHour
  
  //         const eventColor = getEventColor(eventData.type);
  //         return {
  //           id: createEventId(),
  //           title: eventData.type,
  //           description: fullname,
  //           start: eventData.date.substring(0, 10) + "T" + startHour,
  //           end: eventData.date.substring(0, 10) + "T" + endHour,
  //           color: eventColor,
  //         };
  //       }
  //       return null;
  //     });
  
  //     const updatedEvents = (await Promise.all(eventPromises)).filter(
  //       (event) => event
  //     );
  
  //     setInitialEvents(updatedEvents);
  //     setCurrentEvents(updatedEvents);
  //   } catch (error) {
  //     console.error("Error fetching data for the week:", error);
  //   }
  // };
  
  const fetchFullNameRescueCarOwner = async (rvoId) => {
    try {
      const response = await dispatch(
        getRescueVehicleOwnerId({ id: rvoId })
      ).unwrap();

      // Check the structure of response data to find the correct field containing fullname
      const fullname = response.data?.fullname || response.data?.name;
      return fullname;
    } catch (error) {
      console.error("Error fetching fullname of rescue car owener:", error);
      return null;
    }
  };

  // useEffect để theo dõi thay đổi của technicianData và cập nhật description của event
  useEffect(() => {
    // Nếu có technicianData và fullname được trả về từ API
    if (technicianData && technicianData.fullname) {
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

    for (let i = 1; i <= 8; i++) {
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
        flex="1 1 20%"
        backgroundColor={colors.white[50]}
        p="10px"
        borderRadius="16px"
        boxShadow="0 0 10px 0 rgba( 0, 0, 0, 0.1)"
      >
        <Typography variant="h5" sx={{ marginBottom: "10px" }}>
          Sự kiện
        </Typography>
        <StyledList>
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
                primary={event.title}
                secondary={
                  <React.Fragment>
                    <Typography>
                      {new Date(event.start).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </Typography>
                    <Typography>{event.description}</Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </StyledList>
      </Box>
    );
  };

  return (
    <Box ml="20px">
      <Header
        title="Lịch xe cứu hộ"
        subtitle="Trang tương tác toàn bộ xe cứu hộ"
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {renderSidebar()}
        <Box flex="1 1 100%" ml="10px">
          <FullCalendar
            height="80vh"
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
            eventsSet={(events) => setCurrentEvents(events)}
            events={initialEvents}
            select={handleDateSelect}
            eventContent={renderEventContent}
            locale="vi" // Thiết lập ngôn ngữ hiển thị là Tiếng Việt
            timeZone="Asia/Ho_Chi_Minh" // Thiết lập múi giờ là múi giờ Việt Nam
            datesSet={handleDatesSet}
            firstDay={1}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarTechnician;
