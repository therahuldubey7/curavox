// src/components/PDFPreview.js
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack.js';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import html2canvas from 'html2canvas';

// Configure pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPreview = forwardRef((props, ref) => {
  // Update the file path as needed (e.g., "assets/Geometry.pdf")
 //const pdfFile = 'assets/Geometry.pdf';
  const pdfFile = 'assets/M1.pdf';

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  // Ref to the DOM element that will be captured
  const captureRef = useRef(null);

  // Helper: converts a canvas to a Blob and returns a Promise.
  const canvasToBlob = (canvas, type = 'image/png', quality) =>
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, type, quality);
    });

  // Expose the takeScreenshot method to the parent via ref.
  useImperativeHandle(ref, () => ({
    takeScreenshot: async () => {
      try {
        console.log('[PDFPreview] Starting screenshot capture...');
        const canvas = await html2canvas(captureRef.current);
        console.log('[PDFPreview] Canvas captured. Dimensions:', canvas.width, canvas.height);
        console.log('[PDFPreview] Converting canvas to Blob...');
        const blob = await canvasToBlob(canvas, 'image/png');
        console.log('[PDFPreview] Blob created:', blob);
        return blob;
      } catch (err) {
        console.error('[PDFPreview] Screenshot failed!', err);
        return null;
      }
    }
  }));

  const onDocumentLoadSuccess = (pdfInfo) => {
    console.log('[PDFPreview] PDF loaded. Total pages:', pdfInfo.numPages);
    setNumPages(pdfInfo.numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      console.log('[PDFPreview] Switching to previous page:', pageNumber - 1);
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      console.log('[PDFPreview] Switching to next page:', pageNumber + 1);
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        pt: 8,
        minHeight: '100vh',
      }}
    >
      {/* The element that will be captured */}
      <Box ref={captureRef} sx={{ position: 'relative', maxWidth: '800px', width: '100%', p: 2 }}>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
          <Page pageNumber={pageNumber} scale={1.2} />
        </Document>

        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Page {pageNumber} of {numPages}
        </Typography>

        {/* Prev button */}
        <Button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '-60px',
            transform: 'translateY(-50%)',
            backgroundColor: '#000',
            color: '#fff',
            minWidth: '40px',
            ':hover': { backgroundColor: '#555' },
          }}
        >
          <ChevronLeftOutlinedIcon />
        </Button>

        {/* Next button */}
        <Button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          sx={{
            position: 'absolute',
            top: '50%',
            right: '-60px',
            transform: 'translateY(-50%)',
            backgroundColor: '#000',
            color: '#fff',
            minWidth: '40px',
            ':hover': { backgroundColor: '#555' },
          }}
        >
          <ChevronRightOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
});

export default PDFPreview;
