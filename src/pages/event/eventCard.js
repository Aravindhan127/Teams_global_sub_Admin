// React Imports
import { useEffect, useState } from 'react';

// Swiper Imports
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { useLocation, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import EventCard from 'src/views/common/EventCard';
import 'swiper/css';
import PageHeader from 'src/@core/components/page-header';
import { Button, Typography } from '@mui/material';
// Static Event Data
const staticEvents = [
    {
        id: 1,
        name: 'Additive Manufacturing: Prospects and Challenges 2025',
        authorName: 'Addamas',
        eventStartDate: '2024-12-12',
        eventEndDate: '2024-12-13',
        startTime: '10:30 AM',
        endTime: '10:30 PM',
        address: { country: 'USA' },
        ticketPricing: [{ price: 50 }, { price: 80 }],
        eventThumbnailUrl: ['https://via.placeholder.com/300'],
    },
    {
        id: 2,
        name: 'Tech Conference 2025',
        authorName: 'Addamas',
        eventStartDate: '2024-08-08',
        eventEndDate: '2024-08-09',
        startTime: '12:30 AM',
        endTime: '12:30 PM',
        categoryTitle: 'Technology',
        address: { country: 'Canada' },
        ticketPricing: [{ price: 120 }],
        eventThumbnailUrl: ['https://via.placeholder.com/300'],
    },
    {
        id: 3,
        name: 'Food Carnival',
        authorName: 'Addamas',
        eventStartDate: '2024-05-05',
        eventEndDate: '2024-05-06',
        startTime: '7:30 AM',
        endTime: '7:30 PM',
        categoryTitle: 'Food',
        address: { country: 'UK' },
        ticketPricing: [{ price: 30 }],
        eventThumbnailUrl: ['https://via.placeholder.com/300'],
    },
];

const EventsList = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search);
    const slug = params.get('category'); // Get category from URL

    const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     if (slug) {
    //         // Filter events by category if a slug exists
    //         setEvents(staticEvents.filter(event => event.categoryTitle.toLowerCase() === slug.toLowerCase()));
    //     } else {
    //         // Show all events if no category is specified
    //         setEvents(staticEvents);
    //     }
    // }, [slug]);

    return (
        <>
            <PageHeader
                title={
                    <Typography variant="h5">
                        Upcoming Events
                    </Typography>
                }
                action={
                    // (rolePremission?.permissions?.some(
                    //     item => item.permissionName === 'dept.create'
                    // ) || isMasterAdmin === true) ? (
                    <Button variant="contained"
                        onClick={() => navigate('/create-event', { state: { mode: 'add' } })}
                    >
                        Create Event
                    </Button>
                    // ) : null
                }

            />
            <h1></h1>
            <Swiper
                spaceBetween={20}
                slidesPerView={3}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                modules={[FreeMode, Navigation, Pagination, Autoplay]}
                breakpoints={{
                    0: { slidesPerView: 1 },  // Mobile screens
                    800: { slidesPerView: 2 }, // Tablets
                    1600: { slidesPerView: 3 } // Desktops
                }}
            >
                {staticEvents.map((item) => (
                    <SwiperSlide key={item.id} style={{ paddingBottom: '50px' }}>
                        <EventCard
                            data={item}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </>
    );
};

export default EventsList;
