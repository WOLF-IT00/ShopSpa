function TreatmentSteps({ service }) {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        Quy trình liệu trình
      </h2>

      <div className="space-y-6">
        {service.steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
              {index + 1}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {step.title}
              </h3>

              <p className="mt-2 leading-7 text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TreatmentSteps;
