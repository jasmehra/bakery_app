export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Golden Crumb Bakery API",
    version: "1.0.0",
    description: "Node.js + Express + SQLite APIs for bakery content, orders, and contact messages."
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Content" },
    { name: "Admin" },
    { name: "Orders" },
    { name: "Contact" }
  ],
  components: {
    schemas: {
      FeaturedItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          price: { type: "number" },
          image: { type: "string" }
        }
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          note: { type: "string" },
          price: { type: "number" },
          image: { type: "string" }
        }
      },
      GalleryImage: {
        type: "object",
        properties: {
          id: { type: "integer" },
          src: { type: "string" },
          alt: { type: "string" }
        }
      },
      Testimonial: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          text: { type: "string" }
        }
      },
      ContentResponse: {
        type: "object",
        properties: {
          featuredItems: { type: "array", items: { $ref: "#/components/schemas/FeaturedItem" } },
          orderItems: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          galleryImages: { type: "array", items: { $ref: "#/components/schemas/GalleryImage" } },
          testimonials: { type: "array", items: { $ref: "#/components/schemas/Testimonial" } },
          siteSettings: {
            type: "object",
            additionalProperties: { type: "string" }
          }
        }
      },
      AdminContentRequest: {
        type: "object",
        properties: {
          featuredItems: { type: "array", items: { $ref: "#/components/schemas/FeaturedItem" } },
          orderItems: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          galleryImages: { type: "array", items: { $ref: "#/components/schemas/GalleryImage" } },
          testimonials: { type: "array", items: { $ref: "#/components/schemas/Testimonial" } },
          siteSettings: {
            type: "object",
            additionalProperties: { type: "string" }
          }
        }
      },
      CreateOrderRequest: {
        type: "object",
        required: ["orderId", "customer", "pickupTime", "items", "totals"],
        properties: {
          orderId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          customer: {
            type: "object",
            properties: {
              name: { type: "string" },
              phone: { type: "string" }
            }
          },
          pickupTime: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                qty: { type: "integer" },
                unitPrice: { type: "number" },
                lineTotal: { type: "number" }
              }
            }
          },
          totals: {
            type: "object",
            properties: {
              itemCount: { type: "integer" },
              subtotal: { type: "number" }
            }
          }
        }
      },
      CreateContactRequest: {
        type: "object",
        required: ["name", "email", "message"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          message: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean" },
                    serverTime: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/content": {
      get: {
        tags: ["Content"],
        summary: "Get full homepage content",
        responses: {
          200: {
            description: "Content payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContentResponse" }
              }
            }
          }
        }
      }
    },
    "/api/featured-items": {
      get: {
        tags: ["Content"],
        summary: "Get featured menu items",
        responses: {
          200: { description: "List of featured items" }
        }
      }
    },
    "/api/order-items": {
      get: {
        tags: ["Content"],
        summary: "Get orderable items",
        responses: {
          200: { description: "List of order items" }
        }
      }
    },
    "/api/gallery-images": {
      get: {
        tags: ["Content"],
        summary: "Get gallery images",
        responses: {
          200: { description: "List of gallery images" }
        }
      }
    },
    "/api/testimonials": {
      get: {
        tags: ["Content"],
        summary: "Get testimonials",
        responses: {
          200: { description: "List of testimonials" }
        }
      }
    },
    "/api/site-settings": {
      get: {
        tags: ["Content"],
        summary: "Get editable site text settings",
        responses: {
          200: { description: "Site settings key/value pairs" }
        }
      }
    },
    "/api/admin/content": {
      get: {
        tags: ["Admin"],
        summary: "Get full editable content payload for admin page",
        responses: {
          200: {
            description: "Full admin content payload",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContentResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Admin"],
        summary: "Replace all editable content from admin page",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminContentRequest" }
            }
          }
        },
        responses: {
          200: { description: "Content updated" },
          400: { description: "Invalid payload" }
        }
      }
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get saved orders",
        responses: {
          200: { description: "Order list" }
        }
      },
      post: {
        tags: ["Orders"],
        summary: "Create order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" }
            }
          }
        },
        responses: {
          201: { description: "Order created" },
          400: { description: "Invalid payload" }
        }
      }
    },
    "/api/contact-messages": {
      post: {
        tags: ["Contact"],
        summary: "Create contact message",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateContactRequest" }
            }
          }
        },
        responses: {
          201: { description: "Message saved" },
          400: { description: "Invalid payload" }
        }
      }
    }
  }
};
