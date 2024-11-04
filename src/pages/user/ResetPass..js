import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../utils/api"; // Make sure this points to your configured API

export default function ResetPass() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handlePasswordReset = async () => {
    try {
      const values = await form.validateFields(); // Validate all form fields

      // Check if new passwords match
      if (values.new_password !== values.confirm_new_password) {
        message.error("New password and confirm password do not match.");
        return;
      }

      setLoading(true);

      // API call to update the password
      const response = await api.updatePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      });

      if (response.data.success) {
        message.success("Password updated successfully.");
        form.resetFields(); // Reset the form fields
      } else {
        message.error("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        <Form form={form} layout="vertical">
          <Form.Item
            name="old_password"
            label="Old Password"
            rules={[{ required: true, message: "Please enter your old password" }]}
          >
            <Input.Password placeholder="Old Password" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[{ required: true, message: "Please enter your new password" }]}
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item
            name="confirm_new_password"
            label="Confirm New Password"
            rules={[{ required: true, message: "Please confirm your new password" }]}
          >
            <Input.Password placeholder="Confirm New Password" />
          </Form.Item>
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handlePasswordReset}
              className="bg-[#3B82F6] text-white rounded-md hover:bg-[#424D57]"
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
