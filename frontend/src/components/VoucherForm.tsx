import { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { checkVoucher, generateVoucher } from "../api/voucherApi";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import {
    FaUser,
    FaIdBadge,
    FaPlaneDeparture,
    FaCalendarAlt,
    FaChevronDown
} from "react-icons/fa";

export default function VoucherForm() {
    const [form, setForm] = useState({
        name: "",
        id: "",
        flightNumber: "",
        date: "",
        aircraft: "ATR",
    });

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [seats, setSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const aircraftOptions = ["ATR", "Airbus 320", "Boeing 737 Max"];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {

        if (!selectedDate) {
            Swal.fire({
                icon: "warning",
                title: "Date Required",
                text: "Please select a date first.",
            });
            return;
        }

        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        setLoading(true);
        setSeats([]);

        try {
            const check = await checkVoucher({
                flightNumber: form.flightNumber,
                date: formattedDate,
            });

            if (check.data.exists) {
                Swal.fire({
                    icon: "error",
                    title: "Duplicate Flight",
                    text: "Vouchers already generated for this flight and date.",
                });
                return;
            }

            const response = await generateVoucher({
                ...form,
                date: formattedDate, // kirim date baru
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Seats successfully generated!",
                timer: 1500,
                showConfirmButton: false,
            });

            setSeats(response.data.data.seats);

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };





    const inputStyle =
        "w-full border border-gray-300 rounded-xl px-10 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-300 bg-gray-50";

    return (
        <div className="relative min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-100 flex items-center justify-center p-6 overflow-hidden">

            {/* Background Typography */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Diagonal Repeating Background Text */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">

                    <div className="fixed inset-0 rotate-40 flex flex-wrap content-center justify-center gap-10 sm:gap-16 lg:gap-20">
                        {Array.from({ length: 70 }).map((_, i) => (
                            <h1
                                key={i}
                                className="text-[clamp(60px,15vw,180px)] 
                                        sm:text-[clamp(80px,12vw,200px)] 
                                        lg:text-[clamp(100px,8vw,220px)]
                                        font-extrabold text-indigo-400/20 tracking-widest whitespace-nowrap"
                            >
                                AIRLINE
                            </h1>
                        ))}
                    </div>
                </div>
            </div>


            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-xl border border-white/30"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    ✈ Voucher Seat Assignment
                </h2>

                <div className="space-y-5">

                    {/* Crew Name */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input
                            name="name"
                            placeholder="Crew Name"
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    {/* Crew ID */}
                    <div className="relative">
                        <FaIdBadge className="absolute left-3 top-4 text-gray-400" />
                        <input
                            name="id"
                            placeholder="Crew ID"
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    {/* Flight Number */}
                    <div className="relative">
                        <FaPlaneDeparture className="absolute left-3 top-4 text-gray-400" />
                        <input
                            name="flightNumber"
                            placeholder="Flight Number"
                            onChange={handleChange}
                            className={inputStyle}
                        />
                    </div>

                    {/* Date */}
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-4 text-gray-400 z-10" />

                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            dateFormat="dd MMMM yyyy"
                            placeholderText="Select Date"
                            className={inputStyle}
                            popperClassName="z-50"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            scrollableYearDropdown
                            showPopperArrow={false}
                        />


                    </div>

                    {/* Aircraft Dropdown */}
                    <div className="relative">
                        <FaChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                        <div className="relative">

                            {/* Selected */}
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setOpenDropdown(!openDropdown)}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-white shadow-sm hover:shadow-md cursor-pointer flex justify-between items-center transition-all duration-300"
                            >
                                <span className="text-gray-700">{form.aircraft}</span>

                                <motion.div
                                    animate={{ rotate: openDropdown ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaChevronDown className="text-gray-400" />
                                </motion.div>
                            </motion.div>

                            {/* Dropdown List */}
                            <AnimatePresence>
                                {openDropdown && (
                                    <motion.ul
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50"
                                    >
                                        {aircraftOptions.map((option) => (
                                            <motion.li
                                                key={option}
                                                whileHover={{ backgroundColor: "#eef2ff" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setForm({ ...form, aircraft: option });
                                                    setOpenDropdown(false);
                                                }}
                                                className="px-4 py-3 cursor-pointer transition-colors"
                                            >
                                                {option}
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>

                        </div>

                    </div>

                    {/* Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Generating..." : "Generate Vouchers"}
                    </motion.button>
                </div>

                {/* Seats */}
                {seats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8"
                    >
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                            🎟 Generated Seats
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {seats.map((seat) => (
                                <motion.span
                                    key={seat}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold shadow-sm"
                                >
                                    {seat}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
