"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function formatMoney(value) {
  const number = Number(value || 0);
  return `$${number.toFixed(2)}`;
}

function uniqueValues(rows, key) {
  return [...new Set((rows || []).map((row) => row[key]).filter(Boolean))];
}

function getDefaultValue(list, fallback = "") {
  return Array.isArray(list) && list.length > 0 ? list[0] : fallback;
}

export default function OrderPage() {
  const searchParams = useSearchParams();

  const [pricingRows, setPricingRows] = useState([]);
  const [pricingTableLoading, setPricingTableLoading] = useState(true);

  const [productName, setProductName] = useState("");
  const [size, setSize] = useState("");
  const [paper, setPaper] = useState("");
  const [finish, setFinish] = useState("");
  const [sides, setSides] = useState("");
  const [quantity, setQuantity] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [livePrice, setLivePrice] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);

  const [artworkFile, setArtworkFile] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [uploadedArtwork, setUploadedArtwork] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ NEW: read product from URL
  useEffect(() => {
    const productFromUrl = searchParams.get("product");
    if (productFromUrl) {
      setProductName(productFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadPricingTable() {
      try {
        setPricingTableLoading(true);

        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load pricing table.");
        }

        const rows = Array.isArray(data.pricing) ? data.pricing : [];
        setPricingRows(rows);

        if (rows.length > 0) {
          const productFromUrl = searchParams.get("product");

          const first =
            rows.find((r) => r.product_name === productFromUrl) || rows[0];

          setProductName(first.product_name || "");
          setSize(first.size || "");
          setPaper(first.paper || "");
          setFinish(first.finish || "");
          setSides(first.sides || "");
          setQuantity(String(first.quantity ?? ""));
        }
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Failed to load pricing.");
      } finally {
        setPricingTableLoading(false);
      }
    }

    loadPricingTable();
  }, [searchParams]);

  // 🚫 EVERYTHING BELOW IS YOUR ORIGINAL LOGIC (UNCHANGED)

  const allProducts = useMemo(() => {
    return uniqueValues(pricingRows, "product_name");
  }, [pricingRows]);

  const rowsForProduct = useMemo(() => {
    return pricingRows.filter((row) => row.product_name === productName);
  }, [pricingRows, productName]);

  const availableSizes = useMemo(() => {
    return uniqueValues(rowsForProduct, "size");
  }, [rowsForProduct]);

  const rowsForProductAndSize = useMemo(() => {
    return rowsForProduct.filter((row) => row.size === size);
  }, [rowsForProduct, size]);

  const availablePapers = useMemo(() => {
    return uniqueValues(rowsForProductAndSize, "paper");
  }, [rowsForProductAndSize]);

  const rowsForProductSizePaper = useMemo(() => {
    return rowsForProductAndSize.filter((row) => row.paper === paper);
  }, [rowsForProductAndSize, paper]);

  const availableFinishes = useMemo(() => {
    return uniqueValues(rowsForProductSizePaper, "finish");
  }, [rowsForProductSizePaper]);

  const rowsForProductSizePaperFinish = useMemo(() => {
    return rowsForProductSizePaper.filter((row) => row.finish === finish);
  }, [rowsForProductSizePaper, finish]);

  const availableSides = useMemo(() => {
    return uniqueValues(rowsForProductSizePaperFinish, "sides");
  }, [rowsForProductSizePaperFinish]);

  const rowsForFullOptionsMinusQuantity = useMemo(() => {
    return rowsForProductSizePaperFinish.filter((row) => row.sides === sides);
  }, [rowsForProductSizePaperFinish, sides]);

  const availableQuantities = useMemo(() => {
    return [
      ...new Set(
        rowsForFullOptionsMinusQuantity
          .map((row) => Number(row.quantity))
          .filter((v) => !Number.isNaN(v))
      ),
    ].sort((a, b) => a - b);
  }, [rowsForFullOptionsMinusQuantity]);

  const selectedRow = useMemo(() => {
    return pricingRows.find(
      (row) =>
        row.product_name === productName &&
        row.size === size &&
        row.paper === paper &&
        row.finish === finish &&
        row.sides === sides &&
        Number(row.quantity) === Number(quantity)
    );
  }, [pricingRows, productName, size, paper, finish, sides, quantity]);

  // (rest of your file remains EXACTLY the same)
}