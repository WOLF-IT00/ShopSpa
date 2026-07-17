import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    avatar: "https://i.pravatar.cc/150?img=32",
    content:
      "Không gian rất đẹp, nhân viên cực kỳ nhiệt tình. Tôi sẽ quay lại nhiều lần nữa.",
  },
  {
    id: 2,
    name: "Trần Minh Anh",
    avatar: "https://i.pravatar.cc/150?img=12",
    content:
      "Liệu trình massage giúp tôi giảm căng thẳng sau những ngày làm việc mệt mỏi.",
  },
  {
    id: 3,
    name: "Lê Thanh Hương",
    avatar: "https://i.pravatar.cc/150?img=47",
    content:
      "Một trải nghiệm tuyệt vời. Mình rất thích phong cách phục vụ ở đây.",
  },
];

function TestimonialSection() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-[5px] text-emerald-600">
            Testimonials
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-800">
            Khách hàng nói gì?
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3500,
          }}
          pagination={{
            clickable: true,
          }}
          loop
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="mx-auto mb-6 h-24 w-24 rounded-full object-cover"
                />

                <div className="mb-4 text-yellow-500 text-2xl">⭐⭐⭐⭐⭐</div>

                <p className="mx-auto max-w-3xl text-lg italic leading-8 text-gray-600">
                  "{item.content}"
                </p>

                <h3 className="mt-8 text-xl font-bold text-emerald-700">
                  {item.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TestimonialSection;
