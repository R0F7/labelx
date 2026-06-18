import AddRelease from "../_components/add-release";
import ReleaseForm from "./release-form";

export default function CreateReleasePage() {
  return (
    <section className="p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Release</h1>

        <ReleaseForm />
        {/* <AddRelease/> */}
      </div>
    </section>
  );
}
