import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./categories.css";

const categories = [
  {
    title: "Bridal Wear",
    subtitle: "Majestic & Timeless",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIqICAYYoVtfdiloBaEge9TZXU6GxClxvrCIF59fVDxQ4GeaEQztFo3OV8ka3Unk9GLy_GrnYkNmQAkyGkQ3lz6nbLKo4DFubUzwbwaf99Pz0DUuHaV1Mn7KAxbF0DmnPRjjgiKGzefhNK09KB-zGxQ0Dt3CMnY2haxXImcF_r9vRT5LCTaedkhLCIQj-R_Wtva-7jjAsyCc0kwbAXkZnvfsH2MqjDDxqH8RkwoV7CWKj8yrjirQRh_a_3MMcbIT2c870ZiwFnOO8o",
  },
  {
    title: "Party Wear",
    subtitle: "Chic & Glamorous",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPv4v1nlt_b3sPdaUowyoCjAlDvTMnu-IOkCLAW67eAuLKaNFGVMUMCapiqEhdMbMVpsUKYsW0W7Z_q0WcPyAgAiL9kNgXeQ4ZxkU5Ki8rucHFn5tGvy-EdrQsn59GuzuuiVxAqP30JUxkNHQM0O2Xc3dvtF29_EvFN2zAiHfXm17EhDGdswsEOMixdJFgLRBcXenDBSzJ-Mhgr7PDoCI2mq_vIyE9kojqfOwJND-bfrhh7rQI9-CweCZDCUnC6xHCtADsZISYzAgd",
  },
  {
    title: "Casual Used Clothes",
    subtitle: "Elegant & Comfortable",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATWKffXyZAtQsExY5-vJqikzxc1s0r5e74vGCGhzQZw-GPQTt0c_Cmh7IrttkPO3he03GV3Y8Q_H6P6HDSA_mjE9oG3YpqddKj8YnlzAMz96DVV6m0hA9vGvJVFrP-IPuYpA94Y5TCQRwUcGFeG01cHE1mZ6ojcyQTETTMDzMZRKeYFnb3UGdSFWy3nW1ObtpVIwJhdIbgAFZFqNDGjerBtGhmvjVQvKmic_WPXFSGAljHqDUTD1o34uw3mxYbgz93vILXOQU08FjL",
  },
];

const Categories = () => {
  return (
    <section className="categories-page">
      <div className="categories-header">
        <h1>Curated Categories</h1>
        <p>Finest selections for every occasion</p>
      </div>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.title}
            to="/rentDresses"
            className="categories-card-link"
          >
            <Card className="categories-card">
              <div className="categories-card-image">
                <img alt={category.title} src={category.image} />
              </div>
              <CardContent className="categories-card-content">
                <CardTitle className="categories-card-title">
                  {category.title}
                </CardTitle>
                <CardDescription className="categories-card-subtitle">
                  {category.subtitle}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
