"use client";
import React, { Component } from "react";

type Props = { pdf_url: string };

class PDFViewer extends Component<Props> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("PDF Viewer Error:", error, errorInfo);
  }

  render() {
    const { pdf_url } = this.props;

    return (
      <iframe
        src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
        className="w-full h-full"
        title="PDF Viewer"
      ></iframe>
    );
  }
}

export default PDFViewer;
